/**
 *        @file auth.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Authentication Controller Class.
 * @description This file contains function(s) which call our respective service(s) to get the data
 *    @services - UserService
 *   @functions - login()
 *              - forgotPassword()
 *              - changePassword()
 *              - whoami()
 *              - refreshToken()
 *     @returns Express JSON Response
 */

import events from '../events'
import { UserService } from '../services'
import { CUserAuthInfoRequest } from '../db_pool/helper'
import { Response, Request, NextFunction } from 'express'

export class AuthController {
  public static async login(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { username, password } = req.body

    const response = await UserService.login(username, password)
    if (response.success) {
      events.emit('user_logins', response.data.user, req.ip, req.headers.host)
    }
    return res.send(response)
  }

  public static async forgotPassword(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { username } = req.body
    return res.send(await UserService.forgotPassword(username))
  }

  public static async changePassword(req: CUserAuthInfoRequest, res: Response, _next: NextFunction): Promise<Response> {
    if (!req.cUser) {
      return res.json({ success: false, data: { message: 'No user found' } })
    }

    const objSysAdmin = req.cUser
    const { username, oldPassword, newPassword } = req.body

    const userService: UserService = new UserService(objSysAdmin)
    return res.send(await userService.changePassword(username, oldPassword, newPassword))
  }

  public static async whoami(req: CUserAuthInfoRequest, res: Response, _next: NextFunction): Promise<Response> {
    if (!req.cUser) {
      return res.json({ success: false, data: { message: 'No user found' } })
    }

    const objSysAdmin = req.cUser
    return res.send(await UserService.whoami(objSysAdmin.username || ''))
  }

  public static async refreshToken(req: CUserAuthInfoRequest, res: Response, _next: NextFunction): Promise<Response> {
    if (!req.cUser) {
      return res.json({ success: false, data: { message: 'No user found' } })
    }

    const objSysAdmin = req.cUser
    return res.send(await UserService.refreshToken(objSysAdmin.username || ''))
  }
}
