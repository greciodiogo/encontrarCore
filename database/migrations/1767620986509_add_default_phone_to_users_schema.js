'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDefaultPhoneToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.string("default_phone", 255).nullable().after('role')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddDefaultPhoneToUsersSchema
