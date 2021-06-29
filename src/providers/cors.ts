/**
 *        @file cors.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary CORS Class
 * @description Defining response headers to handle CORS
 */

import { logger, prepLogData } from './logger'
import { NextFunction, Response, Request } from 'express'

class CORS {
  public static handle(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Authorization, If-Modified-Since, Cache-control, Pragma, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
    )

    res.header('Access-Control-Expose-Headers', 'File-Name, File-Type')

    /**
     * For now, just return success on all OPTIONS requests.
     * These are typically pre-flight requests from CORS and XSRF headers.
     */
    if (req.method == 'OPTIONS') {
      logger.notice('', prepLogData(req, res, 'express_request'))
      return res.status(200).json({ result: 'success' })
    } else {
      return next()
    }
  }
}

export default CORS
