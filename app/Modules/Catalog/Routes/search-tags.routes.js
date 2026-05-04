'use strict'

module.exports = (ApiRoute, Route) => {
  ApiRoute(() => {
    // Listar tags ativas (público)
    Route.get('/', 'SearchTagController.index')
    
    // Incrementar contador de cliques (público)
    Route.post('/:id/click', 'SearchTagController.incrementClick')
  }, 'search-tags').namespace('App/Modules/Catalog/Controllers')
}
