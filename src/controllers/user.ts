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

export class UserController {
	public static async getAll(req: CUserAuthInfoRequest, res: Response) {
		const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()

		const userService: UserService = new UserService(objSysAdmin)
		return res.send(await userService.getAllUsers())
	}

	public static async adminRegister(req: CUserAuthInfoRequest, res: Response) {
		const objSysAdmin = req.cUser ? req.cUser : Helper.defaultUser()
		const { username, password } = req.body

		const userService: UserService = new UserService(objSysAdmin)
		return res.send(await userService.addUser(username, password, undefined, 'admin'))
	}
}