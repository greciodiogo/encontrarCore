'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIsDeletedToUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('is_deleted').notNullable().defaultTo(false)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddIsDeletedToUserSchema
