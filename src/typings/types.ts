/**
 *        @file types.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Types
 * @description Define types used accross Application
 */

import { User } from '../models/user'
import { TokenExpire } from './interface'

export type NullableAny = any | null | undefined
export type NullableDate = Date | null | undefined
export type NullableString = string | null | undefined
export type NullableNumber = number | null | undefined
export type NullableBoolean = boolean | null | undefined
export type NullableBuffer = Buffer | null | undefined

// Array

export type NullableArrayString = Array<string> | null | undefined

// Custom

export type NullableUser = User | null | undefined
export type NullableTokenExpire = TokenExpire | null | undefined
