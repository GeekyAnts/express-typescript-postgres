/**
 *        @file app.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Authentication routes
 * @description Handles following routes:
 *              - POST '/login'
 *              - POST '/forgot-password'
 *              - POST '/change-password'
 *              - GET  '/whoami'
 *              - GET  '/refresh-token'
 */
import express from 'express'
import { wrapper } from '../helpers'
import Schema from '../middlewares/schema'
import AuthValidator from '../validators/auth'
import { AuthController } from '../controllers'
import CheckAuth from '../middlewares/check_auth'

const router = express.Router()

/**
 * @swagger
 *
 * /v0/auth/login:
 *   post:
 *     tags:
 *      - Auth
 *     summary : Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *             username:
 *                 type: string
 *             password:
 *                 type: string
 *     responses:
 *       200:
 *        description: Success
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
 *                    authToken:
 *                      type: string
 *                    user:
 *                      type: object
 *                    device:
 *                      type: object
 */
router.post(
    '/login',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.login())
    },
    wrapper(AuthController.login)
)

/**
 * @swagger
 * /v0/auth/forgot-password:
 *   post:
 *     tags:
 *     - Auth
 *     summary: Generate new password
 *     requestBody:
 *       description: Username
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.post(
    '/forgot-password',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.forgotPassword())
    },
    wrapper(AuthController.forgotPassword)
)

/**
 * @swagger
 * /v0/auth/change-password:
 *   post:
 *     tags:
 *     - Auth
 *     security:
 *     - BasicAuth: []
 *     summary: Change password
 *     requestBody:
 *       description: user and password details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.post(
    '/change-password',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.changePassword())
    },
    (req, res, next) => {
        CheckAuth.check(req, res, next, '')
    },
    wrapper(AuthController.changePassword)
)

/**
 * @swagger
 *
 * /v0/auth/whoami:
 *   get:
 *     tags:
 *      - Auth
 *     security:
 *     - BasicAuth: []
 *     summary : whoami
 *     responses:
 *       200:
 *        description: Success
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
 *                    user:
 *                      type: object
 */
router.get(
    '/whoami',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.whoami())
    },
    (req, res, next) => {
        CheckAuth.check(req, res, next, '*')
    },
    wrapper(AuthController.whoami)
)

/**
 * @swagger
 *
 * /v0/auth/refresh-token:
 *   get:
 *     tags:
 *      - Auth
 *     security:
 *     - BasicAuth: []
 *     summary : refresh-token
 *     responses:
 *       200:
 *        description: Success
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
 *                    authToken:
 *                      type: string
 *                    user:
 *                      type: object
 *                    device:
 *                      type: object
 */
router.get(
    '/refresh-token',
    (req, res, next) => {
        Schema.handle(req, res, next, AuthValidator.whoami())
    },
    (req, res, next) => {
        CheckAuth.check(req, res, next, '*')
    },
    wrapper(AuthController.refreshToken)
)


export default router
