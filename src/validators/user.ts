/**
 *        @file user.ts
 *  @repository 016-n-3020_impact_api
 * @application 016-n-3020_impact_api
 *     @summary UserValidator Class
 * @description Defines validation structure for user API requests
 */

import * as Joi from 'joi'

class UserValidator {
  public user() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      id_role: Joi.number().required(),
    })
  }

  public editUser() {
    return Joi.object({
      username: Joi.string().required(),
      id_role: Joi.number().required(),
    })
  }
}

export default new UserValidator()
