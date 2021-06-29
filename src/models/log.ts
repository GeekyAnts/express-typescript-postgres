/**
 *        @file log.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Log Class
 * @description Defines the structure for Log model
 */

import { Common } from './common'
import Helper from '../db_pool/helper'
import { NullableAny, NullableDate, NullableNumber, NullableString } from '../typings/types'

export class Log extends Common {
  public id_device: NullableNumber = undefined

  public app_version: NullableString = undefined

  public id_person: NullableNumber = undefined

  public log_filename: NullableString = undefined

  public log_file: NullableAny = undefined

  public record_date: NullableDate = undefined

  constructor(model?: any) {
    super()
    this._table_name = 'app_log'
    if (model) {
      Helper.shallowCopy(model, this)
    }
    return this
  }
}

export default Log
