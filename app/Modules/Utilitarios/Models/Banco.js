'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Banco extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  contas() {
    return this.hasMany("App/Modules/Utilitarios/Models/ContaBancaria")
  }
}

module.exports = Banco
