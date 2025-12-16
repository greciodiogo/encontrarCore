"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Cambio extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }
  moeda() {
    return this.belongsTo("App/Modules/Utilitarios/Models/Moeda");
  }
}

module.exports = Cambio;
