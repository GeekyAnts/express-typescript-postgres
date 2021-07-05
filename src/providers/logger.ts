/**
 *        @file logger.js
 * @application Database (IMPACT) API
 *     @created
 *     @summary Customization for the {@link http://npmjs.com/package/winston | Winston} logging package
 * @description |
 * This is not a generic logger. It is, however, a minimally modified version of the same file used
 * in ITT, converted to TypeScript and customized for the IMPACT API. The one exception to that is an
 * added transport toggling mechanism that can be invoked (or not) when logging a message. (Note, too,
 * that IDE tools reformat the file somewhat.)
 *
 * The logger makes use of the following error severity definitions, from RFC5424. Although these
 * are defined as winston.config.syslog.levels in the Winston package and used in the logger below,
 * for some reason they are redefined in the imported winston-pg module.

 *     Code      Severity
 *     ----      -----------------------------------------
 *       0       Emergency: system is unusable
 *       1       Alert: action must be taken immediately
 *       2       Critical: critical conditions
 *       3       Error: error conditions
 *       4       Warning: warning conditions
 *       5       Notice: normal but significant condition
 *       6       Informational: informational messages
 *       7       Debug: debug-level messages
 * -------------------------------------------------------------------------------------------------
 */
'use strict'

// Winston Logger
import winston, { LogEntry } from 'winston'
import { NextFunction } from 'express'

const chalk = require('chalk') // used for colorizing console output
const moment = require('moment') // used for calculating response times
const uuid4 = require('uuid/v4')
const onFinished = require('on-finished')
const debug_logger = require('debug')('iv:logger')
const level = process.env.LOG_LEVEL || 'debug'
const MESSAGE = Symbol.for('message')

const config = require('../../config');

debug_logger(`logger level = ${level}`)

interface CustomConsoleTransportOptions extends winston.transports.ConsoleTransportOptions {
  name: string
}

interface CustomFileTransportOptions extends winston.transports.FileTransportOptions {
  name: string
}

interface CustomWinstonTransport extends winston.transport {
  name: string
}

/**
 * Add a timestamp for JSON formatted log info
 *
 * @param {object} logEntry - Javascript object containing at least level and msg fields
 *
 * @returns {object}  - the logEntry object with a timestamp field prepended
 **/
const jsonFormatter = (logEntry: LogEntry) => {
  const base = { timestamp: moment().toISOString() }
  return Object.assign(base, logEntry)
}

/**
 * Format the data for a human-readable string matching the way the Morgan package did.
 *
 * Although valid in JavaScript, symbol indexes are invalid in TypeScript. The issue has been
 * flagged as a bug see https://github.com/microsoft/typescript/issues/1863. So, the original,
 * straightforward assignment of a message to a Winston info object using a symbol index:
 *
 *     logEntry[MESSAGE] = 'Blah, blah, blah...'
 *
 * is instead accomplished through a more obscure and less intuitive Object.assign() call:
 *
 *     Object.assign(logEntry, {[MESSAGE], 'Blah, blah, blah...' }).
 *
 * @param {object} logEntry - Javascript object containing at least level and msg fields
 *
 * @returns {object}  - the logEntry reformatted as a string that matches the output of the now discontinued morgan package
 **/
const consoleFormatter = (logEntry: LogEntry): LogEntry => {
  const color =
    logEntry.status === undefined
      ? chalk.white
      : logEntry.status >= 500
      ? chalk.red // red
      : logEntry.status >= 400
      ? chalk.yellow // yellow
      : logEntry.status >= 300
      ? chalk.cyan // cyan
      : logEntry.status >= 200
      ? chalk.green // green
      : chalk.white // no color

  /*
   * 'label' is an optional argument that can be used to provide special handling for any log message
   * here used just for special handling of logging for express requests and responses
   */
  switch (logEntry.label) {
    case 'express_request':
      Object.assign(logEntry, {
        [MESSAGE]:
          `${moment().toISOString()} ` +
          `${logEntry.req.method} ${logEntry.req.url} ` +
          `| hostname: ${logEntry.req.hostname} | ip: ${logEntry.req.ip} | origin: ${logEntry.req.origin}`,
      })
      break

    case 'express_response':
      // colorize the method, url and status part of the string
      const resp_str = color(`${logEntry.req.method} ${logEntry.req.url} (${logEntry.status}) `)
      Object.assign(logEntry, {
        [MESSAGE]:
          `${moment().toISOString()} ` +
          resp_str +
          `${logEntry.res.responseTime} ms - ${logEntry.res.contentLength} b\n\n`,
      })
      logEntry.level = 'notice'
      break

    default:
      Object.assign(logEntry, { [MESSAGE]: logEntry.message })
      break
  }

  return logEntry
}

/**
 * Filter (disable) logging on the given transport when it is not an intended target of the log
 * message. This assumes transport-level formatting. (A different technique, using transport.silent,
 * is needed/possible for filtering using logger-level formatting.) Filtering is accomplished by
 * returning a falsey value, which terminates subsequent formatting and prevents logging on the
 * given transport.
 *
 * Implement log filtering in winston.createLogger() by:
 *     1. Uniquely naming each transport (name: <TransportName>).
 *     2. Including this formatter as the first one supplied to winston.format.combine(), passing
 *        the corresponding opts object as {target: <TransportName>} for each transport (note that
 *        'target' is singular).
 *
 * Filtering is then invoked when a call to logger.log() includes a metadata object having a targets
 * property array (see example below note that 'targets' is plural) listing the transports targeted.
 * Logging will occur for all transport targets named all others will be filtered (disabled). when
 * supplied, the targets property must be an array that is either empty, includes an 'all' element,
 * or includes one or more comma-separated transport names. Since, by default, all transports are a
 * target for logging, no filtering is applied when the targets property is ommitted, when the targets
 * property is an empty array, or when the targets property includes an 'all' element. Supplying the
 * 'all' element with actual transport names is the same as supplying only the 'all' element. When
 * only transport names are supplied in the targets property array, filtering is applied to any
 * transport not named.
 *
 *     logger.log('<level>', '<message>', {targets: ['<TargetName1>', '<TargetName2>']})
 *
 * @param {object} info  Winston info object
 * @param {object} opts  Winston opts object
 * @returns {object} info | false - Mutated Winston info object or false
 **/
const filterTransport = winston.format((info, opts): any => {
  // Fetch the transport that information logging is currently targeting.
  // tslint:disable-next-line: no-use-before-declare
  const transport = logger.transports.find((_transport: CustomWinstonTransport) => {
    return _transport.name === opts.target
  }) as CustomWinstonTransport

  // Determine if the fetched transport was one of the intended targets when logging was invoked.
  const abort =
    Array.isArray(info.targets) &&
    !(info.targets.length === 0 || info.targets.includes('all') || info.targets.includes(transport.name))

  // Abort filters (disables) logging on the current transport.
  return abort ? false : info
})

/**
 * Create and configure a Winston logger.
 *
 * Per-transport names are used in conjunction with the filterTransport() format to facilitate
 * message logging that can target specific transports. Those transports not explicitly targeted are
 * filtered out, that is, disabled from logging that specific message. When no transports are
 * explicitly targeted, all transports log the provided message. See the filterTransport() format.
 *
 * @param {object}  - Javascript object containing configuration information to use for this instance of winston
 *
 * @returns {object} logger - an instance of a Winston logger that logs both to stdout and Postgres
 **/
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,

  transports: [
    // standard console logging
    new winston.transports.Console({
      name: 'console', // Transport Name
      level: level,
      format: winston.format.combine(filterTransport({ target: 'console' }), winston.format(consoleFormatter)()),
    } as CustomConsoleTransportOptions),
    // logging JSON to a file called ismdb_api.log, enabled for initial development and as a functional example of json/file logging
    new winston.transports.File({
      name: 'file', // Transport Name
      filename: 'backend_api.log',
      level: level,
      format: winston.format.combine(filterTransport({ target: 'file' }), winston.format(jsonFormatter)()),
      maxFiles: config.logs.maxFiles,
      maxsize: config.logs.maxFileSize,
      zippedArchive: config.logs.zipOldLogs
    } as CustomFileTransportOptions),
  ],
})

/**
 * Consolidate information from various places for use by the logger instance
 *
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response object
 * @param {string} label - a user-defined discriminator
 *
 * @returns {object} log_data - a Javascript object with some combination of request, response and user data
 **/
const prepLogData = (req: any, res: any, label: any): any => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res._header) : res.headersSent)
    ? res.statusCode
    : undefined

  const log_data = {
    label: label,
    status: status,
    txID: req.txID,
    req: {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      hostname: req.hostname,
      ip: req.ip,
      origin: req.header('origin'),
      client: req.header('x-sbx-itt-client'),
    },
    res: {
      responseTime: res.responseTime,
      contentLength: res.getHeaders()['content-length'],
    },
  }

  if (undefined !== req.sbxUser) {
    Object.assign(log_data, {
      id: req.sbxUser.id || null,
      username: req.sbxUser.username || null,
      id_org: req.sbxUser.id_org || null,
    })
  }
  return log_data
}

// Initialize request
const initRequest = function initRequest(req: any, _res: any, next: NextFunction) {
  // just record the start time and generate a txID
  req.receivedAt = process.hrtime()
  req.txID = uuid4()
  next()
}

//Log responses
const logResponse = (req: any, res: any, next: NextFunction) => {
  // prep the log message ...
  function responseLog() {
    if (res.statusCode !== 401) {
      // calculate elapsed time (initially in ns, convert to ms then display with fixed decimal)
      res.timeDiff = process.hrtime(req.receivedAt)
      res.responseTime = ((res.timeDiff[0] * 1e9 + res.timeDiff[1]) * 1e-6).toFixed(3)
      // log the response
      const log_data = prepLogData(req, res, 'express_response')
      logger.notice('', log_data)
    }
  }
  // but wait until the response if finished to actually log.
  onFinished(res, responseLog)

  next()
}

export { logger, initRequest, logResponse, prepLogData }
