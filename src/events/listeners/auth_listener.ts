/**
 *        @file auth_listener.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary AuthListener Class
 * @description Contains functions for the application events listed in Event @class
 *   @functions - userLogin
 *              - forgotPassword
 *              - newUser
 *     @returns Email Template for a particular event fired
 */

import { email } from '../../../config'
import { CommonService, EmailService } from '../../services'

export interface User {
	id: number
}

export class AuthListener extends CommonService {
	// Store LogIn activity to the DB
	public async userLogin(user: User, ip: string, hostname: string) {
		const columns = '"id_user","date", "ip_address","host_name"'
		const values = '$1, $2, $3, $4'
		const params = [user.id, (new Date), ip, hostname]

		this.type_name = 'user_logins'
		return this.insertRow(columns, values, params)
	}

	public async forgotPassword(username: string, password: string) {
		const service = new EmailService

		return await service.send(username, 'You requested to change your password', 'RESET', `Hello there! <br/><br/> 
			Your request to change your password has been successfully submitted.<br/>
			The new password for your account is <b>${password}</b><br/>

			<br/><br/> <i>Need help? Contact the support team:</i>
			<br/><br/> <i>email: ${email.addresses.support}</i>`)
	}

	public async newUser(username: string) {
		const service = new EmailService;

		return await service.send(username, 'Welcome to the Website!', 'WELCOME', `Hello there! <br/><br/> 
			Your account with handle ${username} has been successfully created.<br/>

			<br/><br/> <i>Need help? Contact the support team:</i>
			<br/><br/> <i>email: ${email.addresses.support}</i>`)
	}
}

export default AuthListener
