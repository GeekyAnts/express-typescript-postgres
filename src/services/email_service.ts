/**
 *        @file email_service.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary EmailService Class
 * @description Defines function to send Email
 *   @functions - send()
 */

import { Client } from 'postmark'
import { email } from '../../config'

interface EmailConfig {
  token: string
  from: string
}

export class EmailService {
  public config: EmailConfig = email.primary

  public client: Client

  constructor() {
    this.client = new Client(this.config.token)
  }

  public async send(To: string, Subject: string, Tag: string, HtmlBody: string) {
    return this.client.sendEmail({
      From: this.config.from,
      To,
      Tag,
      Subject,
      HtmlBody,
    })
  }
}

export default new EmailService()
