'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddNotificationEnhancementsSchema extends Schema {
  up () {
    this.table('notifications', (table) => {
      // Adicionar coluna relatedEntityId para vincular a entidades (pedidos, produtos, etc)
      table.integer('relatedEntityId').unsigned().nullable()
      
      // Adicionar coluna actionUrl para navegação direta
      table.string('actionUrl', 500).nullable()
      
      // Adicionar coluna updatedAt se não existir
      table.timestamp('updatedAt', { useTz: true }).nullable()
      
      // Adicionar índices para melhor performance
      table.index(['userId', 'isRead'], 'idx_notifications_user_isread')
      table.index(['type'], 'idx_notifications_type')
      table.index(['createdAt'], 'idx_notifications_created')
    })
    
    // Executar SQL raw para criar o enum type se necessário
    // Nota: O campo 'type' já existe como text, então vamos apenas garantir que funcione
    this.raw(`
      -- Atualizar registros existentes para ter um tipo padrão
      UPDATE notifications SET type = 'general' WHERE type IS NULL OR type = '';
      
      -- Adicionar comentários às colunas
      COMMENT ON COLUMN notifications.type IS 'Type of notification: order, product, system, promotion, or general';
      COMMENT ON COLUMN notifications."relatedEntityId" IS 'ID of the related entity (e.g., order ID, product ID)';
      COMMENT ON COLUMN notifications."actionUrl" IS 'URL to navigate when notification is clicked';
    `)
  }

  down () {
    this.table('notifications', (table) => {
      // Remover índices
      table.dropIndex(['userId', 'isRead'], 'idx_notifications_user_isread')
      table.dropIndex(['type'], 'idx_notifications_type')
      table.dropIndex(['createdAt'], 'idx_notifications_created')
      
      // Remover colunas
      table.dropColumn('relatedEntityId')
      table.dropColumn('actionUrl')
      table.dropColumn('updatedAt')
    })
  }
}

module.exports = AddNotificationEnhancementsSchema
