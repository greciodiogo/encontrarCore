'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RequestAnalyticsSchema extends Schema {
  up () {
    this.create('request_analytics', (table) => {
      table.increments()
      
      // Identificação da requisição
      table.string('request_id', 100).notNullable().unique()
      table.string('method', 10).notNullable() // GET, POST, PUT, DELETE
      table.string('endpoint', 500).notNullable()
      table.integer('status_code').unsigned()
      table.integer('response_time_ms').unsigned() // Tempo de resposta em ms
      
      // Plataforma e dispositivo
      table.string('platform', 50) // android, ios, web, postman, unknown
      table.string('platform_version', 50) // Android 13, iOS 16.5, Chrome 120
      table.string('app_version', 50) // 1.0.0, 1.1.0
      table.string('device_model', 100) // iPhone 14 Pro, Samsung Galaxy S23
      table.string('os_version', 50) // Android 13, iOS 16.5
      
      // User-Agent e headers
      table.text('user_agent')
      table.string('client_type', 50) // mobile-app, web-app, api-client
      
      // Localização e rede
      table.string('ip_address', 45)
      table.string('country', 100)
      table.string('city', 100)
      
      // Usuário (se autenticado)
      table.integer('user_id').unsigned().nullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
      
      // Dados adicionais
      table.json('request_headers') // Headers importantes
      table.json('query_params') // Query parameters
      table.text('error_message') // Se houver erro
      
      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      
      // Índices para performance
      table.index(['platform', 'created_at'])
      table.index(['endpoint', 'created_at'])
      table.index(['user_id', 'created_at'])
      table.index(['status_code', 'created_at'])
      table.index(['created_at'])
    })
  }

  down () {
    this.drop('request_analytics')
  }
}

module.exports = RequestAnalyticsSchema
