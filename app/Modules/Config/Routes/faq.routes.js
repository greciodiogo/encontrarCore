'use strict';

/**
 * Rotas de FAQs (Perguntas Frequentes)
 */
module.exports = (ApiRoute, Route) => {
  ApiRoute(() => {
    // Rotas públicas
    Route.get('/', 'FaqController.index')
    Route.get('/categories/list', 'FaqController.getCategories')
    Route.get('/category/:category', 'FaqController.getByCategory')
    
    // Rotas administrativas (requerem autenticação)
    Route.post('/', 'FaqController.store').middleware(['auth'])
    Route.put('/:id', 'FaqController.update').middleware(['auth'])
    Route.delete('/:id', 'FaqController.destroy').middleware(['auth'])
  }, 'faqs').namespace('App/Modules/Config/Controllers')
}
