'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopBusinessHoursSchema extends Schema {
  up () {
    this.create('shop_business_hours', (table) => {
      table.increments()
      table.integer('shop_id').unsigned().notNullable().references('id').inTable('shops').onDelete('CASCADE')
      table.integer('day_of_week').notNullable().comment('0-6 (Domingo-Sábado)')
      table.string('open_time', 5).notNullable().comment('Formato: HH:MM')
      table.string('close_time', 5).notNullable().comment('Formato: HH:MM')
      table.boolean('is_active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('shop_business_hours')
  }
}

module.exports = ShopBusinessHoursSchema
