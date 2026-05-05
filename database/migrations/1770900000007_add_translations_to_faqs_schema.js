'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTranslationsToFaqsSchema extends Schema {
  up () {
    this.table('faqs', (table) => {
      // Adicionar campos de tradução em inglês se não existirem
      table.string('question_en', 500).nullable()
      table.text('answer_en').nullable()
      
      // Adicionar campo de categoria se não existir
      table.string('category', 100).nullable().defaultTo('general')
      
      // Adicionar campo de ordem se não existir
      table.integer('order').nullable().defaultTo(0)
      
      // Adicionar campo is_active se não existir
      table.boolean('is_active').nullable().defaultTo(true)
    })
  }

  down () {
    this.table('faqs', (table) => {
      table.dropColumn('question_en')
      table.dropColumn('answer_en')
      table.dropColumn('category')
      table.dropColumn('order')
      table.dropColumn('is_active')
    })
  }
}

module.exports = AddTranslationsToFaqsSchema
