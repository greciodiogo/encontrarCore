'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SearchTagsSchema extends Schema {
  up () {
    this.create('search_tags', (table) => {
      table.increments('id')
      table.string('tag', 100).notNullable().unique()
      table.string('icon', 50).nullable() // Nome do ícone (ex: 'phone', 'laptop', 'fashion')
      table.string('color', 20).nullable() // Cor em hex (ex: '#FF5722')
      table.integer('order').unsigned().defaultTo(0) // Ordem de exibição
      table.boolean('active').defaultTo(true) // Se está ativo
      table.integer('click_count').unsigned().defaultTo(0) // Contador de cliques
      table.timestamps(true, true) // created_at, updated_at
    })
  }

  down () {
    this.drop('search_tags')
  }
}

module.exports = SearchTagsSchema
