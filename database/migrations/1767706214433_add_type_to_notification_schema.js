'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTypeToNotificationSchema extends Schema {
  up () {
    this.table('notifications', (table) => {
      table.text('type');
      // alter table
    })
  }

  down () {
    this.table('notifications', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTypeToNotificationSchema
