'use strict'

const BaseStorageRepository = use('App/Repositories/BaseStorageRepository')

class ShopBusinessHoursRepository extends BaseStorageRepository {
  constructor() {
    super('ShopBusinessHours', 'App/Modules/Catalog/Models/')
  }

  /**
   * Buscar horários de uma loja específica
   */
  findByShopId(shopId) {
    return this.model.query().where('shop_id', shopId).where('is_active', true)
  }

  /**
   * Buscar horários de um dia específico para uma loja
   */
  findByShopAndDay(shopId, dayOfWeek) {
    return this.model.query()
      .where('shop_id', shopId)
      .where('day_of_week', dayOfWeek)
      .where('is_active', true)
  }
}

module.exports = ShopBusinessHoursRepository
