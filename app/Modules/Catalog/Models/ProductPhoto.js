'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Photo = use('App/Modules/Catalog/Models/Photo')

class ProductPhoto extends Photo {
  static boot() {
    super.boot()
    this.addTrait('@provider:Auditable')
  }

  static get table() {
    return 'product_photos'
  }

  /**
   * Relationship with Product
   */
  product() {
    return this.belongsTo('App/Modules/Catalog/Models/Product', 'productId', 'id')
  }
}

module.exports = ProductPhoto

