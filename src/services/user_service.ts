/**
 *        @file user_service.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary UserService Class
 * @description Define Functions that perform CRUD operations on users
 *   @functions - createToken()
 *              - verifyToken()
 *              - decodeToken()
 *              - responseObject()
 *              - getAllUsers()
 *              - addUser()
 *              - login()
 *              - whoami()
 *              - getUserAndAuthToken()
 *              - forgotPassword()
 *              - changePassword()
 *              - getPermissions()
 *              - getDefaultUser()
 */

import events from '../events'
import Helper from '../db_pool/helper'
import * as config from '../../config'
import { Auth, User } from '../models'
import PGPool from '../db_pool/pg_pool'
import { CommonService } from '../services'
import { logger } from '../providers/logger'
import { TokenBody } from '../typings/interface'
import { randomString } from '../helpers'
import messages from '../constants'

const jwt = require('njwt')

export class UserService extends CommonService {
  expReq?: any

  expRes?: any

  constructor(_user: any) {
    super(_user)
  }

  public static async createToken(user: User): Promise<object> {
    // delete user.auth

    const permissionsResult = await UserService.getPermissions(user.username || '')
    const _sbxPermisisons = new Array<string>()

    if (permissionsResult.success) {
      permissionsResult.data.rows?.forEach((element) => {
        _sbxPermisisons.push(element.name)
      })
    }

    const claims = {
      sub: user.username,
      iss: 'https://websiteapp.com',
      sbxUser: user,
      sbxPermissions: _sbxPermisisons,
    }

    const authObj: Auth = new Auth(config.server.apiUuid, config.server.tokenExpiration, user)
    const jwtObj = jwt.create(claims, authObj.tokenSecret)

    jwtObj.setExpiration(
      new Date().getTime() +
        authObj.tokenExpire!.days * 24 * 60 * 60 * 1000 +
        authObj.tokenExpire!.hours * 60 * 60 * 1000 +
        authObj.tokenExpire!.minutes * 60 * 1000 +
        authObj.tokenExpire!.seconds * 1000,
    )

    authObj.token = jwtObj.compact()
    authObj.tokenID = jwtObj.body.jti
    authObj.user = user
    // user_current = user
    return authObj.token
  }

  public static verifyToken(token: any): TokenBody {
    try {
      const verifiedToken = jwt.verify(token, config.server.apiUuid)
      return { success: true, tokenBody: verifiedToken.body }
    } catch (err) {
      return { success: false, error: err }
    }
  }

  public static decodeToken(tokenBody: any): object {
    const dateNow = new Date()
    const timeNow = Math.round(dateNow.getTime() / 1000)
    const secsRem = tokenBody.exp - timeNow

    const authObj: Auth = new Auth(config.server.apiUuid, config.server.tokenExpiration)
    authObj.user = tokenBody.sbxUser
    authObj.permissions = tokenBody.sbxPermissions
    authObj.username = tokenBody.sub
    authObj.expireSecs = secsRem
    authObj.tokenIssuedAt = new Date(tokenBody.iat * 1000)
    authObj.tokenID = tokenBody.jti

    return authObj
  }

  public responseObject(data: any) {
    return {
      id: data.id,
      username: data.username,
      userType: 'admin',
    }
  }

  // get all users
  public async getAllUsers(): Promise<any> {
    const sql = `SELECT users.id, users.username, users.deleted,
			CASE roles.name WHEN 'admin' THEN TRUE ELSE false END AS is_admin,
			roles.id AS id_role, roles.name AS role_name
			FROM users
			LEFT OUTER JOIN user_roles on user_roles.id_user = users.id AND user_roles.deleted=false
			LEFT OUTER JOIN roles on roles.id = user_roles.id_role AND roles.deleted=false
			WHERE users.deleted = false`

    const pool = Helper.pool()
    const query_results = await pool.aquery(this.user_current, sql)

    return {
      success: true,
      data: query_results.rows,
    }
  }

  // add user
  public async addUser(user: User, pool?: PGPool): Promise<any> {
    let pooldefinedLocally = false

    // pool is not supplied, create one AND start transaction
    if (pool === undefined) {
      pooldefinedLocally = true
      pool = Helper.pool()
      // begin transaction
      await Helper.beginTransaction(pool, this.user_current)
    }

    if (!/\S+@\S+\.\S+/.test(user.username || '')) {
      return { success: false, data: { message: messages.errors.user.email } }
    }

    try {
      // insert user row
      const sql_user = `INSERT INTO users (username, salt, hashpass)
				VALUES ('${user.username}', 'salt', '${user.hashpass}') returning id`

      const userResult = await pool.aquery(this.user_current, sql_user, [])

      // insert permissions row
      const sql_user_roles = `INSERT INTO user_roles (id_user, id_role)
				VALUES ($1, $2) returning id`

      const user_role_params = [userResult.rows[0].id, user.id_role]
      const userRoleResult = await pool.aquery(this.user_current, sql_user_roles, user_role_params)

      // commit if there is a transaction
      if (pooldefinedLocally) await Helper.commitTransaction(pool, this.user_current)

      return {
        success: true,
        data: {
          message: messages.success.insert,
          id_user: userResult.rows[0].id,
          id_user_role: userRoleResult.rows[0].id,
        },
      }
    } catch (error) {
      logger.error(`UserService.addUser() Error: ${error}`)
      return { success: false, data: { message: error.detail || error } }
    }
  }

  // login using username AND password AND get user details AND auth token
  public static async login(username: string, password: string) {
    return this.getUserAndAuthToken(username, password, false, false)
  }

  // get user AND auth token without password
  public static async refreshToken(username: string) {
    return this.getUserAndAuthToken(username, '', false, true)
  }

  // Get user details
  public static async whoami(username: string) {
    return this.getUserAndAuthToken(username, '', true, false)
  }

  // Gets user details AND auth token
  public static async getUserAndAuthToken(
    username: string,
    password = '',
    is_whomai = false,
    is_authenticate_without_password = false,
  ) {
    const pool = Helper.pool()
    const cUser = Helper.defaultUser()
    try {
      let sql = `SELECT users.id, users.username, users.deleted,
						CASE roles.name WHEN 'admin' THEN TRUE ELSE false END AS is_admin,
						roles.id AS id_role, roles.name AS role_name
						FROM users
						LEFT OUTER JOIN user_roles on user_roles.id_user = users.id AND user_roles.deleted=false
						LEFT OUTER JOIN roles on roles.id = user_roles.id_role AND roles.deleted=false
						WHERE users.deleted = false 
						AND users.username = $1 `
      let params = [username]

      if (!is_whomai && !is_authenticate_without_password) {
        sql += `AND hashpass=crypt($2, hashpass)`
        params = [username, password]
      }

      const query_results = await pool.aquery(cUser, sql, params)

      if (query_results.rowCount <= 0) {
        throw { message: messages.errors.user.invalidUserPassword, status: 400 }
      }

      const user = Helper.getUser(query_results.rows[0])
      const token = await UserService.createToken(user)

      if (!is_whomai) {
        return {
          success: true,
          data: {
            message: messages.success.user.login,
            authToken: token,
            user: user,
          },
        }
      }
      return {
        success: true,
        data: { user },
      }
    } catch (error) {
      logger.error(`UserService.addUser() Error: ${error}`)
      return { success: false, data: { message: error.message }, status: error.status }
    }
  }

  public async getSingleUser(user: User) {
    const pool = Helper.pool()
    const cUser = Helper.defaultUser()
    const UserID = user.id
    try {
      const sql = `SELECT users.id, users.username, users.deleted,
      CASE roles.name WHEN 'admin' THEN TRUE ELSE false END AS is_admin,
      roles.id AS id_role, roles.name AS role_name
      FROM users
      LEFT OUTER JOIN user_roles on user_roles.id_user = users.id AND user_roles.deleted=false
      LEFT OUTER JOIN roles on roles.id = user_roles.id_role AND roles.deleted=false
      WHERE users.deleted = false 
      AND users.id = $1 `

      const params = [UserID]

      const query_results = await pool.aquery(cUser, sql, params)

      if (query_results.rowCount <= 0) {
        throw { message: messages.errors.notFound, status: 404 }
      }

      const getUser = Helper.getUser(query_results.rows[0])
      return { success: true, data: { getUser } }
    } catch (error) {
      return { success: false, data: { message: error.message }, status: error.status }
    }
  }

  // forgot password
  public static async forgotPassword(_username: string) {
    const newPassword = randomString(config.randomPasswordLength)
    const pool = Helper.pool()
    const objSysAdmin = Helper.defaultUser()
    const sql = `SELECT username, email 
                    FROM users 
                    LEFT OUTER JOIN persons ON users.username = persons.email 
                    WHERE persons.email = $1 OR users.username = $2`
    const userDetails = await pool.aquery(objSysAdmin, sql, [_username, _username])

    const response = {
      success: true,
      data: { message: messages.success.user.passwordReset },
    }

    if (userDetails.rowCount <= 0) {
      return response
    }

    const { username } = userDetails.rows[0]
    try {
      const sqlSet = 'UPDATE users SET hashpass = $1 WHERE username = $2'
      const updatedUser = await pool.aquery(objSysAdmin, sqlSet, [newPassword, username])

      if (updatedUser.rowCount <= 0) {
        throw { message: messages.errors.user.password, status: 400 }
      }

      // Emitting event that "forgot password" has ran successfully
      events.emit('forgot_password', username, newPassword)

      return {
        success: true,
        data: { message: messages.success.user.password },
      }
    } catch (error) {
      return { success: false, data: { message: error.message }, status: error.status }
    }
  }

  // Changes password for given user after verifying old password is matching current password
  public async changePassword(_username: string, oldPassword: string, newPassword: string) {
    const pool = Helper.pool()
    const sqlGet = 'SELECT username, hashpass FROM users WHERE username = $1 AND hashpass=crypt($2, hashpass)'

    const userDetails = await pool.aquery(this.user_current, sqlGet, [_username, oldPassword])

    if (userDetails.rowCount <= 0) {
      return { success: false, data: { message: messages.errors.user.passwordNotMatched } }
    }

    const { username } = userDetails.rows[0]
    try {
      const sqlSet = 'UPDATE users SET hashpass = $1 WHERE username = $2'
      const updatedUser = await pool.aquery(this.user_current, sqlSet, [
        newPassword, // password will be hashed in DB from a trigger
        username,
      ])
      if (updatedUser.rowCount <= 0) {
        throw { message: messages.errors.user.password, status: 400 }
      }
      return {
        success: true,
        data: { message: messages.success.user.password },
      }
    } catch (error) {
      return { success: false, data: { message: error.message }, status: error.status }
    }
  }

  public static async getPermissions(usernameOrEmail: string) {
    const pool = Helper.pool()
    const objSysAdmin = Helper.defaultUser()
    const sql = `SELECT distinct name FROM permissions 
			INNER JOIN role_permissions on permissions.id = role_permissions.id_permission
			INNER JOIN user_roles on role_permissions.id_role = user_roles.id_role 
			INNER JOIN users on user_roles.id_user = users.id
			WHERE  users.username = $1 `
    const result = await pool.aquery(objSysAdmin, sql, [usernameOrEmail])

    if (result.rowCount > 0) {
      return {
        success: true,
        data: {
          message: `Permissions for user ${usernameOrEmail}`,
          rows: result.rows,
        },
      }
    }

    return {
      success: false,
      data: {
        message: messages.success.user.email,
      },
    }
  }

  public getDefaultUser(reset?: boolean) {
    if (reset || !this.user_current || !this.user_current.id || !this.user_current.username) {
      this.user_current = new User()
      this.user_current.username = 'user_default'
    }

    return this.user_current
  }

  public async updateUser(user: User) {
    const pool = Helper.pool()

    if (!/\S+@\S+\.\S+/.test(user.username || '')) {
      return { success: false, data: { message: messages.errors.user.email } }
    }
    try {
      // begin transaction
      await Helper.beginTransaction(pool, this.user_current)
      let user_columns = `username = '${user.username}'`
      if (user.hashpass) user_columns += `, hashpass = '${user.hashpass}'`
      // update users
      const user_sql = `UPDATE users SET ${user_columns} WHERE id = '${user.id}'`

      const res = await pool.aquery(this.user_current, user_sql, [])
      if (!res.rowCount) throw { message: 'User does not exist', status: 404 }

      const roles_columns = `id_role = '${user.id_role}'`
      // update user_roles
      const roles_sql = `UPDATE user_roles SET ${roles_columns} WHERE id_user = '${user.id}'`

      await pool.aquery(this.user_current, roles_sql, [])

      //commit transaction
      await Helper.commitTransaction(pool, this.user_current)
      return { success: true, data: { message: messages.success.update } }
    } catch (error) {
      logger.error(`UserService.updateUser() Error: ${error}`)
      return { success: false, data: { message: error.detail || error.message }, status: error.status }
    }
  }

  public async getAllRoles(): Promise<any> {
    return await this.getRows('select id, name, label, description, rank, active from roles', [])
  }
}

export default UserService
