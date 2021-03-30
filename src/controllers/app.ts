/**
 *        @file app.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Application Controller Class.
 * @description This file contains function(s) which returns Application related data.
 *   @functions - version()
 *     @returns Express JSON Response
 */

 import { Response } from 'express'

import { apiVersion } from '../providers/version'
import { CUserAuthInfoRequest } from '../db_pool/helper'

export class AppController {
	public static async version(_req: CUserAuthInfoRequest, res: Response) {
		return res.send({ success: true, data: apiVersion })
	}
}