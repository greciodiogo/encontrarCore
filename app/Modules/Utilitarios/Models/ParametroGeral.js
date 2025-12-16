"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParametroGeral extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }
}

module.exports = ParametroGeral;
