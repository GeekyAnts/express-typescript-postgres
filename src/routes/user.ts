/**
 *        @file app.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary User routes
 * @description Handles following routes:
 *              - GET  '/'
 *              - POST '/add-admin'
 */
import express from 'express'

import Schema from '../middlewares/schema'
import AuthValidator from '../validators/auth'
import { UserController } from '../controllers'
import CheckAuth from '../middlewares/check_auth'
import { wrapper } from '../helpers'

const router = express.Router()

router.get(
    '/',
    (req, res, next) => {
        CheckAuth.check(req, res, next, 'user_read')
    },
    wrapper(UserController.getAll)
)

/**
 * @swagger
 * /v0/user/add-admin:
 *  post:
 *    tags:
 *    - Admin
 *    security:
 *    - BasicAuth: []
 *    summary: Add Admin
 *    requestBody:
 *      description: Admin Object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
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
router.post(
    '/add-admin',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.addAdmin())
    },
    // TODO: For now (while doing the development) we're keeping add admin as an open route
    // (req, res, next) => {
    //     CheckAuth.check(req, res, next, 'add_admin')
    // },
    wrapper(UserController.adminRegister)
)

export default router
