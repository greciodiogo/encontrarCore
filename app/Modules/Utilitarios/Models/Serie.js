"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Serie extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }
  /**
   * @method documento
   * @return {Object}
   */
  documento() {
    return this.belongsTo("App/Modules/Utilitarios/Models/Documento");
  }
  armazem() {
    return this.belongsTo("App/Modules/Logistica/Models/Armazen",'armazem_id');
  }
}

module.exports = Serie;
