/**
 *        @file user.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary User Class
 * @description Defines the structure for user model
 */

import { Common } from './common'
import Helper from '../db_pool/helper'
import { NullableBoolean, NullableNumber, NullableString } from '../typings/types'

/**
 * User class (instances throughout code as cUser)
 *
 * This class is instantiated for each endpoint call and contains information about the user and
 * session associated with the endpoint call.
 *
 * @class User
 */

export class User extends Common {
  public username: NullableString = undefined

  public salt: NullableString = undefined

  public hashpass: NullableString = undefined

  public id_role: NullableNumber = undefined

  public role_name: NullableString = undefined

  public is_admin: NullableBoolean = undefined

  constructor(model?: any) {
    super()
    if (model) {
      Helper.shallowCopy(model, this)
    }
  }
}

export default User
