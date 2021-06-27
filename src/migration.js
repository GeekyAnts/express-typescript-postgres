#!/usr/bin/env node
/**
 * Creating new migration
 */
'use strict'
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

inquirer
    .prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'What operation best defines your new migration?',
            choices: [
                'data: INSERT into database',
                'schema: Database schema changes',
                'function: Database functions',
            ],
            filter(val) {
                return val.split(':')[0]
            },
        }
    ])
    .then((answers) => {
        const date = new Date()
        const date_prefix = `${date.getFullYear()}${('0' +(date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}`
        const migration_folder = path.join(__dirname, '../database/migrations')
        const files = fs
            .readdirSync(migration_folder)
            .filter((file) => file.includes(date_prefix))
        const file_index = ('00' + (files.length + 1)).slice(-3)
        const { operation } = answers
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'file_name',
                    message:
                        `What should be the file name? (${date_prefix}-${file_index}-${operation}_<YOUR_INPUT>.sql)`,
                    default() {
                        return 'new_migration'
                    },
                },
            ])
            .then((output) => {
                const { file_name } = output
                fs.writeFileSync(
                    `${migration_folder}/${date_prefix}-${file_index}-${operation}_${file_name}.sql`,
                    ''
                )
            })
    })
