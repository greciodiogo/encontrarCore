'use strict'

/**
 * Rotas para gerenciamento de endereços/zonas de entrega
 */
module.exports = function (ApiRoute, Route) {
  // Listar todos os endereços (com filtros e paginação)
  // GET /api/addresses?page=1&perPage=20&search=talatona&hasGps=true&isZone=true
  Route.get('/api/addresses', 'AddressController.index')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Buscar endereço específico por ID
  // GET /api/addresses/:id
  Route.get('/api/addresses/:id', 'AddressController.show')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Criar novo endereço
  // POST /api/addresses
  // Body: { name, price, latitude, longitude, radius_km, is_zone, visible }
  Route.post('/api/addresses', 'AddressController.store')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Atualizar endereço existente
  // PUT /api/addresses/:id
  // Body: { name, price, latitude, longitude, radius_km, is_zone, visible }
  Route.put('/api/addresses/:id', 'AddressController.update')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Deletar endereço
  // DELETE /api/addresses/:id
  Route.delete('/api/addresses/:id', 'AddressController.destroy')
    .namespace('App/Modules/Utilitarios/Controllers')
}
