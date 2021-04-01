/**
 *        @file app.ts
 *  @repository 016-n-3020_impact_api
 * @application 016-n-3020_impact_api
 *     @summary User routes
 * @description Handles following routes:
 *              - GET  '/'
 *              - POST '/add-admin'
 */
import express from 'express'

import Schema from '../../middlewares/schema'
import UserValidator from '../../validators/user'
import { UserController } from '../../controllers'
import CheckAuth from '../../middlewares/check_auth'
import { wrapper } from '../../helpers'

const router = express.Router()

/**
 * @openapi
 * /v0/user/roles:
 *  get:
 *    tags:
 *    - User
 *    security:
 *    - BasicAuth: []
 *    summary: View User Roles
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
 *                    result:
 *                      $ref: '#/components/schemas/roles'
 */
router.get(
  '/roles',
  (req, res, next) => {
    CheckAuth.check(req, res, next, 'user_create')
  },
  wrapper(UserController.getRoles)
)
/**
 * @openapi
 * /v0/user/add:
 *  post:
 *    tags:
 *    - User
 *    security:
 *    - BasicAuth: []
 *    summary: Add User
 *    requestBody:
 *      description: User Object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
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
 *                    id_user:
 *                      type: number
 *                    id_user_role:
 *                      type: number
 */
router.post(
  '/add',
  (req, res, next) => {
    Schema.handle(req, res, next, UserValidator.user())
  },
  (req, res, next) => {
    CheckAuth.check(req, res, next, 'user_create')
  },
  wrapper(UserController.addUser)
)
/**
 * @openapi
 * /v0/user:
 *  get:
 *    tags:
 *    - User
 *    security:
 *    - BasicAuth: []
 *    summary: View Users
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
  '/',
  (req, res, next) => {
    CheckAuth.check(req, res, next, 'user_read')
  },
  wrapper(UserController.getAll)
)
/**
 * @openapi
 * /v0/user/{id_user}:
 *  get:
 *    tags:
 *    - User
 *    security:
 *    - BasicAuth: []
 *    summary: View User
 *    parameters:
 *    - schema:
 *        type: integer
 *      required: true
 *      in: path
 *      name: id_user
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
  '/:id_user',
  (req, res, next) => {
    CheckAuth.check(req, res, next, 'user_read')
  },
  wrapper(UserController.getUser)
)
/**
 * @openapi
 * /v0/user/{id_user}:
 *  put:
 *    tags:
 *    - User
 *    security:
 *    - BasicAuth: []
 *    summary: Edit User
 *    parameters:
 *    - schema:
 *        type: integer
 *      required: true
 *      in: path
 *      name: id_user
 *    requestBody:
 *      description: User Object
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
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
router.put(
  '/:id_user',
  (req, res, next) => {
    Schema.handle(req, res, next, UserValidator.editUser())
  },
  (req, res, next) => {
    CheckAuth.check(req, res, next, 'user_update')
  },
  wrapper(UserController.updateUser)
)

export default router
