'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BannersSchema extends Schema {
  up () {
    this.create('banners', (table) => {
      table.increments()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.string('image_url_pt', 500).nullable().comment('Caminho da imagem em Português')
      table.string('image_url_en', 500).nullable().comment('Caminho da imagem em Inglês')
      table.string('link_url', 500).nullable().comment('URL de destino ao clicar no banner')
      table.integer('order').defaultTo(0).comment('Ordem de exibição')
      table.boolean('is_active').defaultTo(true)
      table.timestamps()
      
      // Índices para melhor performance
      table.index(['is_active', 'order'])
    })
  }

  down () {
    this.drop('banners')
  }
}

module.exports = BannersSchema
