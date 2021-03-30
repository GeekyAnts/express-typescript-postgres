/**
 *        @file app.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Application routes
 * @description Handles following routes:
 *              - GET '/version'
 */
import express from 'express'

import { wrapper } from '../helpers'
import { AppController } from '../controllers'

const router = express.Router()

/**
 * @swagger
 * /v0/app/version:
 *  get:
 *    tags:
 *    - App
 *    summary: Get API Version
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 */
router.get(
	'/version',
	wrapper(AppController.version)
)

export default router