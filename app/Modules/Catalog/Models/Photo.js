'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Photo extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Auditable')
  }

  product() {
    return this.belongsTo(
      'App/Modules/Catalog/Models/Product',
      'productId',  // foreign key in product_photos table
      'id'          // id in products table
    )
  }

  static get table() {
    return 'photos'
  }

  static get createdAtColumn() {
    return 'created'
  }

  static get updatedAtColumn() {
    return 'updated'
  }
}

module.exports = Photo

