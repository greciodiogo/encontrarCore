'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTranslationsToCategoriesSchema extends Schema {
  up () {
    this.table('categories', (table) => {
      // Adicionar colunas de tradução em inglês
      table.string('name_en', 255).nullable().after('name')
      table.text('description_en').nullable().after('description')
      
      // Índices para melhor performance em buscas
      table.index('name_en')
    })
  }

  down () {
    this.table('categories', (table) => {
      table.dropColumn('name_en')
      table.dropColumn('description_en')
    })
  }
}

module.exports = AddTranslationsToCategoriesSchema
