'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Products extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  static get table () {
    return 'products'
  }
}

module.exports = Products
