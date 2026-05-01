'use strict'

/*
|--------------------------------------------------------------------------
| SearchTagsSeeder
|--------------------------------------------------------------------------
|
| Popula a tabela search_tags com tags de pesquisa sugeridas iniciais
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class SearchTagsSeeder {
  async run () {
    const tags = [
      { tag: 'iPhone', icon: 'phone_iphone', color: '#000000', order: 1, active: true },
      { tag: 'Samsung', icon: 'smartphone', color: '#1428A0', order: 2, active: true },
      { tag: 'Laptop', icon: 'laptop', color: '#4CAF50', order: 3, active: true },
      { tag: 'Headphones', icon: 'headphones', color: '#FF5722', order: 4, active: true },
      { tag: 'TV', icon: 'tv', color: '#9C27B0', order: 5, active: true },
      { tag: 'Câmera', icon: 'camera_alt', color: '#FF9800', order: 6, active: true },
      { tag: 'Gaming', icon: 'sports_esports', color: '#E91E63', order: 7, active: true },
      { tag: 'Smartwatch', icon: 'watch', color: '#00BCD4', order: 8, active: true },
      { tag: 'Tablet', icon: 'tablet', color: '#795548', order: 9, active: true },
      { tag: 'Acessórios', icon: 'cable', color: '#607D8B', order: 10, active: true }
    ]

    // Inserir apenas se a tabela estiver vazia
    const count = await Database.table('search_tags').count('* as total')
    
    if (count[0].total === 0) {
      await Database.table('search_tags').insert(tags)
      console.log('✅ 10 search tags inseridas com sucesso!')
    } else {
      console.log('ℹ️  Search tags já existem, pulando seeder')
    }
  }
}

module.exports = SearchTagsSeeder
