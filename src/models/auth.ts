/**
 *        @file auth.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Auth Class
 * @description Defines the structure for auth model
 */

import {
  NullableAny,
  NullableString,
  NullableBoolean,
  NullableTokenExpire,
  NullableArrayString,
  NullableUser,
} from '../typings/types'

import { TokenExpire } from '../typings/interface'

export class Auth {
  public username: NullableString = undefined

  public user: NullableUser = undefined

  public roles: NullableArrayString = undefined

  public token: NullableAny = undefined

  public tokenID: NullableAny = undefined

  public tokenBody: NullableAny = undefined

  public permissions: NullableArrayString = undefined

  public expireSecs: NullableAny = undefined

  public tokenIssuedAt: NullableAny = undefined

  public tokenSecret: NullableString = undefined

  public tokenExpire: NullableTokenExpire = undefined

  public is_patient: NullableBoolean = undefined

  public is_clinician: NullableBoolean = undefined

  public is_admin: NullableBoolean = undefined

  constructor(tokenSecret: string, tokenExpire: TokenExpire, userOb?: any) {
    this.tokenSecret = tokenSecret
    this.tokenExpire = tokenExpire
    if (userOb) {
      this.user = userOb
    }
    return this
  }
}

export default Auth
