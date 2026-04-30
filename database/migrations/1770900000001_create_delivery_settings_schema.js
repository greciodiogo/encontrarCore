'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateDeliverySettingsSchema extends Schema {
  up () {
    this.create('delivery_settings', (table) => {
      table.increments()
      table.string('key', 100).notNullable().unique().comment('Chave da configuração')
      table.text('value').notNullable().comment('Valor da configuração')
      table.string('type', 20).notNullable().defaultTo('string').comment('Tipo: string, number, boolean, json')
      table.text('description').nullable().comment('Descrição da configuração')
      table.timestamps()
    })
  }

  down () {
    this.drop('delivery_settings')
  }
}

module.exports = CreateDeliverySettingsSchema
