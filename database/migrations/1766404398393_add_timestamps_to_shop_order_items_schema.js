'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTimestampsToShopOrderItemsSchema extends Schema {
  up () {
    this.table('shop_order_items', (table) => {
      // alter table
      table.timestamps()
    })
  }

  down () {
    this.table('shop_order_items', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTimestampsToShopOrderItemsSchema
