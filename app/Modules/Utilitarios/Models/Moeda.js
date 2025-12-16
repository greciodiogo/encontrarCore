"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Moeda extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }
  cambio() {
    return this.hasMany("App/Modules/Utilitarios/Models/Cambio").select('id','valor_cambio','moeda_id').where("is_actived", true)
  }
}

module.exports = Moeda;
