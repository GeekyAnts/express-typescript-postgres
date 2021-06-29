/**
 *        @file index.ts
 *  @repository 000-a-3100_api_boilerplate
 * @application 000-a-3100_api_boilerplate
 *     @summary Event Class
 * @description Handles all the Application Events
 *      @events - user_logins
 *              - forgot_password
 *              - new_user
 */

import { EventEmitter } from 'events'
import AuthListener, { User } from './listeners/auth_listener'

class Event extends EventEmitter {}

const events = new Event()
const authListeners = new AuthListener({})

// Listen to whenever some one hits LogIn
events.on('user_logins', async (user: User, ip: string, hostname: string) =>
  authListeners.userLogin(user, ip, hostname),
)

// Listen to success forgot password events
events.on('forgot_password', async (username: string, password: string) =>
  authListeners.forgotPassword(username, password),
)

// Listens to newly created user events
events.on('new_user', async (username: string) => authListeners.newUser(username))

export default events
