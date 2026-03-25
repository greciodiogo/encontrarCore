'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ShopBusinessHours extends Model {
  static boot() {
    super.boot()
  }

  shop() {
    return this.belongsTo('App/Modules/Catalog/Models/Shops', 'shop_id', 'id')
  }

  static get table() {
    return 'shop_business_hours'
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at'])
  }
}

module.exports = ShopBusinessHours
