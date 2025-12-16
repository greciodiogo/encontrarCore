'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Log extends Model {
    static boot() {
        super.boot()
        this.addTrait('@provider:Auditable')
    }

    user(){
        return this.belongsTo("App/Modules/Security/Users/Models/User","user");
    }
}

module.exports = Log
