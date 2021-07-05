/**
 *        @file index.sample.js
 *  @repository express-typescript-postgres
 * @application express-typescript-postgres
 *     @summary Server-specific configuration settings for the APIs.
 * @description This is an example of the config file which holds all the confidential credentials.
 */

interface dbClient {
	user: string
	password: string | undefined
	database: string
	host: string
	port: number
	ssl: boolean
	max: number
	idleTimeoutMillis: number
}

/**
 * Database Connection Profile (Primary)
 * PostgreSQL database connection profile (object), used to make a privilaged server-side (non-application)
 * connection to the InnVoyce database.
 */
export const dbObj: dbClient = {
	user: 'db_username',
	password: 'db_password',
	database: 'db_dbname',
	host: 'db_host',
	port: 5432,
	ssl: false,
	max: 20,
	idleTimeoutMillis: 10000,
}

/**
 * Server Configuration
 * Configurable server object required by the API include settings for the server port (port), a UUID
 * used to encode the authorization token (apiUuid), and the duration of that token (tokenExpiration).
 */
export const server = {
	port: 9000,
	apiUuid: '0eb14adc-a16e-400c-8f55-7d6c016bb36d',
	tokenExpiration: {
		days: 1,
		hours: 8,
		minutes: 0,
		seconds: 0,
	}
}

export const bcrypt = {
	saltRounds: 10,
}

/**
 * Email Configuration
 * Postmark (https://postmarkapp.com/) is the email delivery service used for emails sent from the
 * InnVoyce database API (for invitation and password resets, for example). The official
 * Postmark-maintained Postmark.js package for Node.js is used to access a given virtual Postmark
 * server and utilize the Postmark API. Each Postmark server is intended to correspond to a given
 * code server, that is, one each for the dev, stage, and prod servers to which code is deployed.
 * Below, the Postmark Server API Token (pmServerApiToken) identifies and authenticates to a specific
 * Postmark server, from which all InnVoyce database API email on the associated code
 * server will be sent. Again, that Server API Token should differ across the various API code servers.
 * Also, note that the from address below must satisfy Postmark's Sender Signature requirements, that
 * is, it must be a verified domain or single email address.
 */

export const email = {
	primary: {
		token: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		from: 'support@geekyants.com'
	},

	addresses: {
		support: 'support@geekyants.com'
	}
};

/**
 * Generate a random password of your desired
 * length.
 */

export const randomPasswordLength = 10;

/**
 * Customize your logs & don't let them occupy
 * too much space.
 */

export const logs = {
	maxFiles: 5,
	maxFileSize: 20971520, // 20 MB
	zipOldLogs: true
}
