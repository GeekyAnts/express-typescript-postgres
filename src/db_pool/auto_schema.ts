/**
 *        @file auto_schema.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary AutoSchema Class
 * @description Contains all auto database schema updates related functions
 *   @functions - insertScripts()
 *              - updateSchema()
 *              - updateSnapshots()
 */

import fs from 'fs'
import Helper from './helper'
import PGPool from './pg_pool'
import { logger } from '../providers/logger'

export default class AutoSchema {
  public static async insertScripts(pool: PGPool, dbName: string, scriptPath: string) {
    let sql = ''
    let params: Array<any> | undefined = []
    let lastScriptName: string
    let successfulScripts: Array<any> | undefined = []

    let scriptNames = []
    let scriptSQL = ''

    let i = 0
    sql = `SELECT "script_name" FROM "database_updates" ORDER BY "script_name" DESC LIMIT 1`

    const successfulScriptsSql = `SELECT script_name FROM database_updates WHERE 
    id_dbupdate_status = (SELECT id FROM database_update_statuses WHERE name = 'successful') or
	  id_dbupdate_status = (SELECT id FROM database_update_statuses WHERE name = 'pending') 
    ORDER BY "script_name"`

    try {
      const res = await pool.aquery(Helper.defaultUser(), sql, params)
      const result = await pool.aquery(Helper.defaultUser(), successfulScriptsSql, params)
      sql = ''
      params = []

      successfulScripts = result.rowCount ? result.rows.map((item) => item.script_name) : undefined
      lastScriptName = res.rowCount ? res.rows[0].script_name : undefined
      logger.info(
        `\n${dbName}: lastScriptName: ${lastScriptName} (Last script previously loaded into the ${dbName} database.)`,
      )

      try {
        scriptNames = fs.readdirSync(scriptPath)
      } catch (e) {
        throw e
      }

      scriptNames.sort((a, b) => a.localeCompare(b))
      logger.info(`${dbName}: Number of scripts: ${scriptNames.length}`)
      scriptNames.forEach((scriptName) => {
        if (
          fs.statSync(scriptPath + '/' + scriptName).isFile() &&
          (undefined === lastScriptName ||
            scriptName.toLowerCase() > lastScriptName.toLowerCase() ||
            !successfulScripts?.includes(scriptName))
        ) {
          logger.info(`${dbName}: Loading: ${scriptName}`)
          scriptSQL = fs.readFileSync(scriptPath + '/' + scriptName, 'utf8')

          sql += `($${++i}, $${++i}, 1), `
          params!.push(scriptName, scriptSQL)
        }
      })

      if (sql.length > 0) {
        sql = `INSERT INTO "database_updates" ("script_name", "script_sql", "id_dbupdate_status")
					VALUES ${sql.replace(/\), $/, ')')}`
        try {
          const insRes = await pool.aquery(Helper.defaultUser(), sql, params)
          return `${insRes.command} affected ${insRes.rowCount} record${insRes.rowCount > 1 ? 's' : ''}`
        } catch (err) {
          err.text = err.toString()
          throw err
        }
      } else {
        return `${dbName}: : No scripts to INSERT.`
      }
    } catch (err) {
      logger.error(`${dbName}: AutoSchema.insertScripts() Query: ${sql}`)
      logger.error(`${dbName}: AutoSchema.insertScripts() Error: ${err}`)
      err.text = err.toString()
      throw err.text
    }
  }

  public static async updateSchema(pool: PGPool, dbName: string) {
    // API User (Since autoupdates are a system maintenance operation, handle as api_user.)
    const sql = 'SELECT public.db_auto_schema_update()'
    const params: Array<any> = []

    try {
      const res = await pool.aquery(Helper.defaultUser(), sql, params)
      if (res.rows[0].db_auto_schema_update) {
        logger.info(`${dbName}: All Automated Schema Updates (if any) completed successfully`)
        return `${dbName}: All Automated Schema Updates (if any) completed successfully`
      } else {
        throw new Error(
          `${dbName} ERROR: Automated Schema Updates did NOT complete successfully!\n` +
            '\tAn automated schema update script encountered an error. That script has\n' +
            '\tbeen marked "failed" and the error logged in DatabaseUpdates. Correct\n' +
            '\tthat script, then restart the server to continue. All scripts\n' +
            '\tprior to the failed script completed successfully.',
        )
      }
    } catch (err) {
      logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${sql}`)
      logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${err}`)
      err.text = err.toString()
      throw err
    }
  }

  public static async updateSnapshots(pool: PGPool, dbName: string) {
    const sql = "SELECT * FROM information_schema.tables WHERE table_schema='public'"

    const createTable = async (table: any) => {
      try {
        const getTables = `SELECT * FROM information_schema.columns WHERE table_name = '${table.table_name}'`
        const getConstraints = `SELECT
						tc.constraint_name, tc.constraint_type, tc.table_name, kcu.column_name, 
						ccu.table_name AS foreign_table_name,
						ccu.column_name AS foreign_column_name 
					FROM information_schema.table_constraints AS tc 
						JOIN information_schema.key_column_usage AS kcu
							ON tc.constraint_name = kcu.constraint_name
						JOIN information_schema.constraint_column_usage AS ccu
							ON ccu.constraint_name = tc.constraint_name
					WHERE tc.table_name='${table.table_name}';`

        const getComments = `SELECT obj_description(oid), * FROM pg_class WHERE relname='${table.table_name}'`

        const result = await pool.aquery(Helper.defaultUser(), getTables, [])
        const result1 = await pool.aquery(Helper.defaultUser(), getConstraints, [])
        const result2 = await pool.aquery(Helper.defaultUser(), getComments, [])

        const returnStatement =
          `CREATE TABLE public.${table.table_name}(
	${result.rows.map((column: any) => {
    return `${column.column_name} ${column.data_type} ${column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${
      column.column_default !== null ? `DEFAULT ${column.column_default} ` : ''
    }`
  })},
	${result1.rows.map((contraint: any) => {
    return `CONSTRAINT ${contraint.constraint_name} ${contraint.constraint_type} (${contraint.column_name}) ${
      contraint.constraint_type === 'FOREIGN KEY'
        ? `REFERENCES public.${contraint.foreign_table_name} (${contraint.foreign_column_name}) `
        : ''
    }`
  })}
	)`.split(' ,').join(`,
	`) +
          `
	${result2.rows.map((comments: any) => {
    return comments.obj_description !== null
      ? `COMMENT ON TABLE public.${comments.relname}
		IS '${comments.obj_description}'`
      : ''
  })}`
        return returnStatement.replace(/^\s*$(?:\r\n?|\n)/gm, '')
      } catch (error) {
        logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${sql}`)
        logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${error}`)
        return error
      }
    }

    try {
      const res = await pool.aquery(Helper.defaultUser(), sql, [])

      res.rows.forEach(async (table: any) => {
        fs.writeFile(`../database/snapshots/${table.table_name}.sql`, await createTable(table), (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
      })
      console.log(
        '\x1b[32m%s\x1b[0m',
        `${dbName}: All Automated Table Snapshot Updates (if any) completed successfully`,
      )
    } catch (err) {
      logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${sql}`)
      logger.error(`${dbName}: AutoSchema.updateSchema() Query: ${err}`)
    }
  }
}
