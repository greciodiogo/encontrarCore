'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SplashScreensSchema extends Schema {
  up () {
    this.create('splash_screens', (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.string('image_url', 500).notNullable()
      table.integer('order').unsigned().notNullable().defaultTo(0).comment('Ordem de exibição')
      table.integer('duration').unsigned().notNullable().defaultTo(3000).comment('Duração em milissegundos')
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('splash_screens')
  }
}

module.exports = SplashScreensSchema
