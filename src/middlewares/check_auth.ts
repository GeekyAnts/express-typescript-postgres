/**
 *        @file check_auth.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Check Authentication Class
 * @description Authentication middleware that checks logged in user scope
 *     @service - UserService
 *   @functions - check()
 */

import { UserService } from '../services'
import { Response, Request, NextFunction } from 'express'

export class CheckAuth {
  public async check(req: Request, res: Response, next: NextFunction, permission: string) {
    const token = req.headers.authorization?.split(' ')[1]
    const vToken = UserService.verifyToken(token)
    if (!vToken.success) {
      return res.send({
        success: false,
        data: { message: 'Invalid Token' },
      })
    }

    const cUser = vToken.tokenBody?.sbxUser
    cUser.username = vToken.tokenBody?.sbxUser?.username || 'user_default'

    const permissions = vToken.tokenBody?.sbxPermissions
    if (cUser) {
      // @ts-ignore: Unreachable code error
      req.cUser = cUser
    }

    if (cUser.is_admin || permission === '*') {
      return next()
    } else if (permissions && permissions.includes(permission)) {
      return next()
    } else {
      return res.send({
        success: false,
        data: { message: 'Out of user scope' },
      })
    }
  }
}

export default new CheckAuth()
