import swaggerJsdoc from 'swagger-jsdoc'
import swaggerParser from '@apidevtools/swagger-parser'
import fs from 'fs'
import path from 'path'

import options from '.'
const YAML = require('json-to-pretty-yaml')

/**
 * This function extracts and validates a fully dereferenced OpenAPI
 * specification from source code using the swagger-jsdoc and
 * swagger-parser packages configured via the swagger/swagger.ts file
 *
 * If successful, the fully dereferenced file is written to swagger/impact_api.yaml.
 * If the extraction or validation fail, the error file is written to ./openapi_err.txt
 *
 * @returns 0 for success, 1 for error
 */
export default async function main(): Promise<number> {
  try {
    // extract the full specification from source code
    const oas3Specification: any = swaggerJsdoc(options)

    // dereference all references and validate using swagger parser
    const api = await swaggerParser.validate(oas3Specification)
    const yaml_api = YAML.stringify(api)
    // dump the resulting valid API (in YAML format) to the swagger folder
    const apiFile = path.join('swagger', 'backend_api.yaml')
    fs.writeFileSync(apiFile, yaml_api)

    // log the result and return no error
    console.log('\x1b[32m%s\x1b[0m', `Valid OpenAPI spec in file ${apiFile}: Valid`)
    return 0
  } catch (err) {
    fs.writeFileSync('openapi_err.txt', err)

    // log failure and return non-zero value
    console.log('There is a problem with the OpenAPI spec in the code, error file written to openapi_err.txt')
    return 1
  }
}
