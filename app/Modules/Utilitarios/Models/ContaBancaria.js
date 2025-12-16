'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ContaBancaria extends Model {
    static boot() {
        super.boot();
        this.addTrait("@provider:Auditable");
    }
    banco() {
        return this.belongsTo("App/Modules/Utilitarios/Models/Banco");
    }
    moeda() {
      return this.belongsTo("App/Modules/Utilitarios/Models/Moeda");
    }
}

module.exports = ContaBancaria
