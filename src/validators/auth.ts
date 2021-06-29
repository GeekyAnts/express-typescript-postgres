/**
 *        @file auth.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary AuthValidator Class
 * @description Defines validation structure for auth API requests
 */

import * as Joi from 'joi'

class AuthValidator {
  public login() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
  }

  public addAdmin() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
  }

  public forgotPassword() {
    return Joi.object({
      username: Joi.string().required(),
    })
  }

  public changePassword() {
    return Joi.object({
      username: Joi.string().required(),
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    })
  }

  public whoami() {
    return Joi.object({})
  }
}

export default new AuthValidator()
