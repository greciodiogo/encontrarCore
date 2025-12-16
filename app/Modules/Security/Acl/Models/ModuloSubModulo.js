'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')

class ModuloSubModulo extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Auditable')
  }

  static get connection() {
    return this.useConnection !== "undefined" ? this.useConnection : config.get('database.connection')
  }

  static setUseConnection(access) {
    return access
  }

  subModulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo").with('modulos', (builder) => { builder.where('is_principal', false)});
  }

  subModulo() {
    return this.belongsTo("App/Modules/Security/Acl/Models/Modulo", "submodulo_id");
  }

  modulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/Modulo").with('modulos', (builder) => { builder.where('is_principal', true)});
  }

  static get table() {
    return 'modulo_submodulos'
  }

}

module.exports = ModuloSubModulo
