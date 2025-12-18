'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopOrderItemsSchema extends Schema {
  up () {
    this.create('shop_order_items', (table) => {
      table.increments()
      table.integer('shop_order_id').unsigned().references('id').inTable('shop_orders').onDelete('CASCADE')
      table.integer('order_item_id').unsigned().references('id').inTable('order_items').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('shop_order_items')
  }
}

module.exports = ShopOrderItemsSchema
