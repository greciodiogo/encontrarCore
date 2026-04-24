'use strict'

const Route = use('Route')

Route.group(() => {
  // Buscar avaliações de um produto (público)
  Route.get('/products/:id/ratings', 'ProductRatingController.index')
  
  // Buscar média de rating (público)
  Route.get('/products/:id/ratings/average', 'ProductRatingController.average')
  
  // Criar avaliação (autenticado ou anônimo)
  Route.post('/products/:id/ratings', 'ProductRatingController.store')
  
  // Atualizar avaliação (autenticado)
  Route.put('/ratings/:id', 'ProductRatingController.update').middleware(['auth'])
  
  // Deletar avaliação (autenticado)
  Route.delete('/ratings/:id', 'ProductRatingController.destroy').middleware(['auth'])
  
}).prefix('api').namespace('App/Modules/Catalog/Controllers')
