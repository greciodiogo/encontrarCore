'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductRatingsSchema extends Schema {
  up () {
    this.create('product_ratings', (table) => {
      table.increments('id').primary()
      table.integer('productId').unsigned().notNullable()
      table.integer('userId').unsigned().nullable()
      table.integer('rating').notNullable() // 1-5
      table.text('comment').nullable()
      table.timestamp('created').defaultTo(this.fn.now())
      table.timestamp('updated').defaultTo(this.fn.now())

      // Foreign keys
      table.foreign('productId').references('id').inTable('products').onDelete('CASCADE')
      table.foreign('userId').references('id').inTable('users').onDelete('SET NULL')

      // Índices
      table.index('productId')
      table.index('userId')
      table.index(['productId', 'userId']) // Para verificar se usuário já avaliou
    })
  }

  down () {
    this.drop('product_ratings')
  }
}

module.exports = ProductRatingsSchema
