'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Shops extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  static get table () {
    return 'shops'
  }
}

module.exports = Shops
