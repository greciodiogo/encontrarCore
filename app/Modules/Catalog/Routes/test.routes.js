'use strict'

module.exports = (ApiRoute, Route) => {
  /**
   * Rotas de teste do módulo de Produtos (APENAS LEITURA)
   * Seguro para usar em produção - sem modificações no banco de dados
   */
  Route.group(() => {
    Route.get('/test/health', 'ProductTestController.health')
    Route.get('/test/db-connection', 'ProductTestController.testConnection')
    Route.get('/test/verify-products-table', 'ProductTestController.verifyProductsTable')
    Route.get('/test/table-info', 'ProductTestController.getTableInfo')
    Route.get('/test/list-products', 'ProductTestController.listProducts')
  }, {
    namespace: 'App/Modules/Catalog/Controllers',
    prefix: 'v1'
  })
}
