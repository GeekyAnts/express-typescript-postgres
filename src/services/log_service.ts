/**
 *        @file log_service.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary LogService Class
 * @description Define Functions that perform CRUD operations on logs
 *   @functions - addLog()
 *              - viewLog()
 *              - viewAllLogs()
 */

import { Log } from '../models'
import { CommonService } from './common_service'

export class LogService extends CommonService {
  public _person_type: string

  constructor(_user: any) {
    super(_user)
  }

  public async addLog(log: Log) {
    console.log(log)
    /*
        const sql = `
            SELECT  "id_device", "softwareVersionString", "nxtLogFilename", 
            "teamID", "recordDate", encode("nxtLogFile", 'escape') AS "nxtLogFile" 
            FROM "ittNXTLogs"
            WHERE "nxtLogID" = $1
        `
        const params = [id]
        */
  }

  public async viewLog(log: Log) {
    this.type_name = log._table_name!
    const result = await this.getById(log.id || 0)

    if (result.success === true) {
      result.data.result = new Log(result.data.result[0])
    }
    return result
  }

  public async viewAllLogs(_log: Log) {
    this.type_name = _log._table_name!
    const result = await this.getFilteredRows('deleted = false', [])
    const log_array: Array<Log> = []
    if (result.success === true) {
      result.data.result.map((log: Log) => log_array.push(new Log(log)))
      result.data.result = log_array
    }
    return result
  }
}

export default LogService
