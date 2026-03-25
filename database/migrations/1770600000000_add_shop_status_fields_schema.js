'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddShopStatusFieldsSchema extends Schema {
  up () {
    this.table('shops', (table) => {
      table.string('status', 30).nullable()
      table.boolean('is_manual_override').defaultTo(false)
      table.timestamp('last_status_change').nullable()
    })
  }

  down () {
    this.table('shops', (table) => {
      table.dropColumn('status')
      table.dropColumn('is_manual_override')
      table.dropColumn('last_status_change')
    })
  }
}

module.exports = AddShopStatusFieldsSchema
