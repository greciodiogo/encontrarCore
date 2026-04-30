'use strict'

/**
 * Rotas para cálculo de taxa de entrega e geocoding
 */
module.exports = function (ApiRoute, Route) {
  // Calcular taxa de entrega por coordenadas
  // POST /api/delivery/calculate-fee
  // Body: { latitude, longitude }
  Route.post('/api/delivery/calculate-fee', 'DeliveryController.calculateFee')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Obter endereço por coordenadas (geocoding reverso)
  // GET /api/delivery/address-by-coordinates?lat=X&lng=Y
  Route.get('/api/delivery/address-by-coordinates', 'DeliveryController.getAddressByCoordinates')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // Gerenciar configurações de entrega
  // GET /api/delivery/settings - Listar todas as configurações
  Route.get('/api/delivery/settings', 'DeliverySettingsController.index')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // GET /api/delivery/settings/:key - Buscar configuração específica
  Route.get('/api/delivery/settings/:key', 'DeliverySettingsController.show')
    .namespace('App/Modules/Utilitarios/Controllers')
  
  // PUT /api/delivery/settings/:key - Atualizar configuração
  // Body: { value: "novo_valor" }
  Route.put('/api/delivery/settings/:key', 'DeliverySettingsController.update')
    .namespace('App/Modules/Utilitarios/Controllers')
}
