import { Response } from 'express'

interface responseObject {
  success: boolean
  data: object
  status?: number
}

export class ResponseWrapper {
  public res: Response

  constructor(response: Response) {
    this.res = response
  }

  public handle(response: responseObject, success_code: number, fail_code: number): Response {
    if (response.success) {
      return this.res.status(success_code).send(response)
    }
    if (response.status) {
      fail_code = response.status
    }

    delete response.status
    return this.res.status(fail_code).send(response)
  }

  public created(response: responseObject): Response {
    return this.handle(response, 201, 400)
  }

  public ok(response: responseObject): Response {
    return this.handle(response, 200, 400)
  }

  public unauthorized(response: responseObject): Response {
    return this.handle(response, 200, 401)
  }

  public forbidden(response: responseObject): Response {
    return this.handle(response, 200, 403)
  }
}
