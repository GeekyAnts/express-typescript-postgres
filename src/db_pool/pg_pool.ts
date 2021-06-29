/**
 *        @file pg_pool.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary PGPool Class
 *   @functions - query()
 *              - aquery()
 *              - connect()
 */

'use strict'

import pg from 'pg'
import { User } from '../models'

const types = pg.types
const timestamp_OID = 1114

const parseDates = (val: string) => new Date(Date.parse(val + '+0000'))

types.setTypeParser(timestamp_OID, parseDates)

/**
 * To get PG notices in the log, use something like the following:
 *     client.on('notice', (msg) => console.log(`pg notice: ${msg}`))
 *
 * Should probably be implemented as part of a debug_pg implementation
 */

interface Callback {
  (err: null | Error, res?: pg.QueryResult): void | Error | pg.QueryResult
}

export default class PGPool {
  pool: pg.Pool

  constructor(dbConfig: pg.PoolConfig) {
    this.pool = new pg.Pool(dbConfig)

    this.pool.on('error', function (err: Error, _client: any) {
      console.log(`Idle-Client Error:\n${err.message}\n${err.stack}`)
    })
  }

  query(cUser: User, sqlText: string, params: any[] = [], callback: Callback) {
    if (!cUser) {
      return callback(new Error('Database user not defined.'))
    }
    this.pool.connect(function (err: Error, client: any, done: any) {
      if (err) {
        return callback(err)
      }
      client.query(`SET SESSION postgres.username = '${cUser.username}'`, [], function (err: Error) {
        if (err) {
          done()
          return callback(err)
        } else {
          client.query(sqlText, params, function (_err: Error, res: any) {
            done()
            if (_err) {
              return callback(_err)
            }
            return callback(null, res)
          })
        }
      })
    })
  }

  async aquery(cUser: User, sqlText: string, params: any[] = []): Promise<pg.QueryResult<any>> {
    const client = await this.pool.connect()
    try {
      await client.query(`SET SESSION postgres.username = '${cUser.username}'`, [])
      const result = await client.query(sqlText, params)

      return result
    } catch (e) {
      throw e
    } finally {
      client.release()
    }
  }

  /**
   * Create a client using one of the pooled connections
   *
   * @return client
   */
  async connect(): Promise<pg.PoolClient> {
    const client = await this.pool.connect()
    return client
  }
}
