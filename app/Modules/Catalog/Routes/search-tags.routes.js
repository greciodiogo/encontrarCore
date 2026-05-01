'use strict'

const Route = use('Route')

Route.group(() => {
  // Listar tags ativas (público)
  Route.get('search-tags', 'SearchTagController.index')
  
  // Incrementar contador de cliques (público)
  Route.post('search-tags/:id/click', 'SearchTagController.incrementClick')
})
  .prefix('api')
  .namespace('App/Modules/Catalog/Controllers')

module.exports = Route
