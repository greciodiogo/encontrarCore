"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Tpa extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }
  contaBancaria() {
    return this.belongsTo(
      "App/Modules/Utilitarios/Models/ContaBancaria",
      "contabancaria_id"
    ).with("moeda");
  }
  banco() {
    return this.belongsTo("App/Modules/Utilitarios/Models/Banco");
  }
  loja() {
    return this.belongsTo("App/Modules/Operacoes/Lojas/Models/Loja");
  }
}

module.exports = Tpa;
