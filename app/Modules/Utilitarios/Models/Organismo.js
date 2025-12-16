'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organismo extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  operador() {
    return this.belongsTo("App/Modules/Security/Users/Models/User").select("name", "id");
  }
}

module.exports = Organismo
