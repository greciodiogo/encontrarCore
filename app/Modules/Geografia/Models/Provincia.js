'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provincia extends Model {
    static boot() {
        super.boot()
        this.addTrait('@provider:Auditable')
    }
    imposto() {
      return this.belongsTo("App/Modules/Utilitarios/Models/Imposto");
    }
}

module.exports = Provincia
