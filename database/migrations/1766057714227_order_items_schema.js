'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderItemsSchema extends Schema {
  up () {
    this.table('order_items', (table) => {
      table.integer('shop_id').unsigned().references('id').inTable('shops')
      table.string('status', 30).defaultTo('PENDING')
      table.decimal('subtotal', 10, 2)
      // alter table
    })
  }

  down () {
    this.table('order_items', (table) => {
      table.dropColumn('shop_id')
      table.dropColumn('status')
      table.dropColumn('subtotal')
      // reverse alternations
    })
  }
}

module.exports = OrderItemsSchema
