'use strict'

const Schema = use('Schema')

class DeviceTokensSchema extends Schema {
  up() {
    this.create('device_tokens', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.text('token').notNullable()
      table.string('device_name').nullable()
      table.string('device_type').defaultTo('mobile') // mobile, web, tablet
      table.boolean('is_active').defaultTo(true)
      table.timestamps()
      
      // Índices para melhor performance
      table.index('user_id')
      table.unique('token')
    })
  }

  down() {
    this.drop('device_tokens')
  }
}

module.exports = DeviceTokensSchema
