'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSourceToOrdersSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      // Campo para identificar a origem do pedido
      table.string('source', 50).defaultTo('unknown').comment('Origem do pedido: web, android, ios, admin')
      
      // Campo JSON para detalhes adicionais da origem
      table.json('source_details').nullable().comment('Detalhes da origem: user-agent, versão do app, etc')
      
      // Índice para facilitar queries por origem
      table.index('source')
    })
  }

  down () {
    this.table('orders', (table) => {
      table.dropColumn('source')
      table.dropColumn('source_details')
    })
  }
}

module.exports = AddSourceToOrdersSchema
