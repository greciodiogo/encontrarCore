'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ShopOrder extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  orderItems() {
    return this.hasMany('App/Modules/Sales/Models/ShopOrderItem', 'shop_order_id', 'id')
  }

  static get table () {
    return 'shop_orders'
  }

}

module.exports = ShopOrder
