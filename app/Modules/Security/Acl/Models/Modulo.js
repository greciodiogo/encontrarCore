'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')

class Modulo extends Model {
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

  moduloSubModulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo").with("subModulos");
  }

  moduloSubModulosSubModulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo", "submodulo_id")
  }

  modulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo").with("modulos")
  }

  submodulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo").with("modulos")
  }
  
  subModulos() {
    return this.hasMany("App/Modules/Security/Acl/Models/ModuloSubModulo", "modulo_id").with("modulos",(builder) => { builder.where('modulos.is_principal', false).where('modulos.is_deleted', false)})
  }

  static get table() {
    return 'modulos'
  }

}

module.exports = Modulo
