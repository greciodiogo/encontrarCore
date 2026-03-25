'use strict'

const Route = use('Route')

module.exports = () => {
  Route.group(() => {
    // Status da loja
    Route.get('/:id/status', 'ShopStatusController.show')
    Route.post('/:id/status', 'ShopStatusController.update').middleware(['role:admin,manager,sales'])
    Route.delete('/:id/status', 'ShopStatusController.destroy').middleware(['role:admin,manager,sales'])

    // Horários de funcionamento
    Route.get('/:id/business-hours', 'ShopBusinessHoursController.index')
    Route.post('/:id/business-hours', 'ShopBusinessHoursController.store').middleware(['role:admin,manager,sales'])
    Route.put('/:shopId/business-hours/:id', 'ShopBusinessHoursController.update').middleware(['role:admin,manager,sales'])
    Route.delete('/:shopId/business-hours/:id', 'ShopBusinessHoursController.destroy').middleware(['role:admin,manager,sales'])
    Route.delete('/:id/business-hours', 'ShopBusinessHoursController.destroyAll').middleware(['role:admin,manager,sales'])
  }, 'shops')
    .namespace('App/Modules/Catalog/Controllers')
    .middleware(['auth'])
    .prefix('api/shops')
}
