'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Shops extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  products() {
    return this.hasMany('App/Modules/Catalog/Models/Product', 'shopId', 'id')
  }

  businessHours() {
    return this.hasMany('App/Modules/Catalog/Models/ShopBusinessHours', 'shop_id', 'id')
  }

  static get table () {
    return 'shops'
  }
}

module.exports = Shops
