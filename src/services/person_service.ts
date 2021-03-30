/**
 *        @file person_service.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary PersonService Class
 * @description Define Functions that perform CRUD operations on persons
 *   @functions - personHandle()
 *              - viewPerson()
 *              - viewAllPersons()
 *              - addPerson()
 *              - deletePerson()
 *              - updatePerson()
 */

import Helper from '../db_pool/helper'
import { logger } from '../providers/logger'
import { CommonService, UserService } from './'

export class PersonService extends CommonService {
	public _person_type: string

	constructor(_user: any) {
		super(_user)
	}

	public async personHandle(sql: string, params?: Array<any>) {
		const pool = Helper.pool()
		let result: any

		try {
			if (params) {
				result = await pool.aquery(this.user_current, sql, params)
			} else {
				result = await pool.aquery(this.user_current, sql)
			}

			if (result.rowCount === 0) {
				throw 'No data found'
      }
      
			return { success: true, data: { result: result.rows } }
		} catch (error) {
			logger.error(`PersonService.personHandle() Query: ${sql}`)
			logger.error(`PersonService.personHandle() Error: ${error}`)
			return { success: false, data: { message: error?.detail || error } }
		}
	}

	public async viewPerson(_person_id: number) {
		const params_ID = _person_id
		const condition = `P.id = $1 and P.id_person_type = (SELECT id from person_types where name = '${this._person_type}')`
		const sql = `SELECT P.*, U.username FROM persons P JOIN users U ON (P.id = U.id_person) where ${condition} and P.deleted = false`
		return this.personHandle(sql, [params_ID])
	}

	public async addPerson(
		columns: string,
		values: string,
		username: string,
		params: Array<any>,
		_id_person_clinician?: number
	) {
		const pool = Helper.pool()

		try {
			// begin transaction 
			await Helper.beginTransaction(pool, this.user_current)

			// insert person
			const sql = `INSERT into "persons" (${columns}, "id_person_type")
				VALUES (${values}, (SELECT id FROM person_types WHERE name = '${this._person_type}')) returning id`

			const result = await pool.aquery(this.user_current, sql, params)
			const person_id = result.rows[0].id

			const userService: UserService = new UserService(this.user_current)
			const addUserForPrson = await userService.addUser(username, 'website', person_id, this._person_type, pool)

			if (!addUserForPrson.success) {
				throw addUserForPrson.data.message
			}

			if (this._person_type === 'patient') {
				// const id_person_clinician_ = this.user_current.is_admin ? id_person_clinician
				// 	: this.user_current.id_person

				// Proceed further with the patient delegation
			}

			await Helper.commitTransaction(pool, this.user_current)
			return { success: true, data: { message: 'Row(s) inserted', result: { id_person: person_id, id_user: addUserForPrson.data.id_user } } }

		} catch (error) {
			logger.error(`PersonService.addPerson() Error: ${error}`)
			return { success: false, data: { message: error.detail || error } }
		}
	}

	public async deletePerson(person_id: number) {
		const pool = Helper.pool()
		try {
			await Helper.beginTransaction(pool, this.user_current)

			const sql_person = `UPDATE persons SET deleted = true WHERE id = $1 and deleted = false
				and id_person_type = (SELECT id from person_types where name = '${this._person_type}')`
			const sql_user = `UPDATE users SET deleted = true WHERE id_person = $1 and deleted = false`

			const result_person = await pool.aquery(
				this.user_current, sql_person, [person_id]
			)
			const result_user = await pool.aquery(
				this.user_current, sql_user, [person_id]
			)

			if (result_person.rowCount > 0 && result_user.rowCount > 0) {
				await Helper.commitTransaction(pool, this.user_current)
			} else {
				throw 'No records found'
			}

			return {
				success: true,
				data: { message: 'Row(s) deleted' },
			}

		} catch (error) {
			logger.error(`PersonService.deletePerson() Error: ${error}`)
			return { success: false, data: { message: error } }
		}
	}

	public async updatePerson(setPerson: string, setUser: string) {
		const pool = Helper.pool()
		try {
			await Helper.beginTransaction(pool, this.user_current)

			const person_sql = `UPDATE persons SET ${setPerson}`
			const user_sql = `UPDATE users SET ${setUser}`

			const result = await pool.aquery(this.user_current, person_sql)
			if (setUser && setUser !== '') {
				await pool.aquery(this.user_current, user_sql)
			}

			if (result.rowCount === 0) throw `Row(s) not updated`

			await Helper.commitTransaction(pool, this.user_current)
			return { success: true, data: { message: 'Row(s) updated' } }

		} catch (error) {
			logger.error(`PersonService.updatePerson() Query: ${setPerson}`)
			logger.error(`PersonService.updatePerson() Error: ${error}`)
			return { success: false, data: { message: error.detail || error } }
		}
	}
}

export default PersonService
