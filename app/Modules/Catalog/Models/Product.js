'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Products extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  shop() {
    return this.belongsTo('App/Modules/Catalog/Models/Shops', 'shopId', 'id')
  }

  /**
   * Relationship with ProductPhotos
   */
  photos() {
    return this.hasMany('App/Modules/Catalog/Models/ProductPhoto', 'productId', 'id')
  }

  photos() {
    return this.hasMany(
      'App/Modules/Catalog/Models/ProductPhoto',
      'id',                // id of current model (products.id)
      'productId'          // foreign key in product_photos table
    )//.where('is_deleted', 0) // Add this if you have soft deletes
  }
  
  static get createdAtColumn() {
    return 'created'
  }

  static get updatedAtColumn() {
    return 'updated'
  }

  static get table () {
    return 'products'
  }
}

module.exports = Products
