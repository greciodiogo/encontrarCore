'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDeliveryScheduleToOrderDeliveriesSchema extends Schema {
  up () {
    this.table('order_deliveries', (table) => {
      table.string('delivery_option', 20).defaultTo('standard')
        .comment('Tipo de entrega: standard ou scheduled')
      table.date('scheduled_date').nullable()
        .comment('Data agendada para entrega')
      table.string('scheduled_time', 20).nullable()
        .comment('Horário agendado (ex: 14:00 - 14:30)')
    })
  }

  down () {
    this.table('order_deliveries', (table) => {
      table.dropColumn('scheduled_time')
      table.dropColumn('scheduled_date')
      table.dropColumn('delivery_option')
    })
  }
}

module.exports = AddDeliveryScheduleToOrderDeliveriesSchema
