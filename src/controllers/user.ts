/**
 *        @file user.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary User Controller Class.
 * @description This file contains function(s) which call our respective service(s) to get the data
 *    @services - UserService
 *   @functions - getAll()
 *              - adminRegister()
 *     @returns Express JSON Response
 */

import { Response } from 'express'
import { UserService } from '../services'
import Helper, { CUserAuthInfoRequest } from '../db_pool/helper'
import { User } from '../models'
import { ResponseWrapper } from '../helpers/response_wrapper'

export class UserController {
  public static async getAll(req: CUserAuthInfoRequest, res: Response) {
    const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()

    const userService: UserService = new UserService(objSysAdmin)
    const response: ResponseWrapper = new ResponseWrapper(res)

    return response.ok(await userService.getAllUsers())
  }

  public static async addUser(req: CUserAuthInfoRequest, res: Response) {
    const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()
    const { password } = req.body
    const user = new User({ hashpass: password, ...req.body })

    const userService: UserService = new UserService(objSysAdmin)
    const response: ResponseWrapper = new ResponseWrapper(res)

    return response.created(await userService.addUser(user))
  }

  public static async getUser(req: CUserAuthInfoRequest, res: Response) {
    const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()
    const user = new User()
    user.id = parseInt(req.params.id_user)
    const reg = new RegExp('^[0-9]+$')
    if (!reg.test(req.params.id_user)) return res.send({ success: false, data: { message: 'Invalid User Id' } })

    const userService: UserService = new UserService(objSysAdmin)
    const response: ResponseWrapper = new ResponseWrapper(res)

    return response.ok(await userService.getSingleUser(user))
  }

  public static async updateUser(req: CUserAuthInfoRequest, res: Response) {
    const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()
    const { password } = req.body
    const user = new User({ hashpass: password, ...req.body })
    user.id = parseInt(req.params.id_user)
    const reg = new RegExp('^[0-9]+$')
    if (!reg.test(req.params.id_user)) return res.send({ success: false, data: { message: 'Invalid User Id' } })

    const userService: UserService = new UserService(objSysAdmin)
    const response: ResponseWrapper = new ResponseWrapper(res)

    return response.created(await userService.updateUser(user))
  }

  public static async getRoles(req: CUserAuthInfoRequest, res: Response) {
    const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()
    const userService: UserService = new UserService(objSysAdmin)
    const response: ResponseWrapper = new ResponseWrapper(res)

    return response.ok(await userService.getAllRoles())
  }
}
