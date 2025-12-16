'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')

class PermissionField extends Model {
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
}

module.exports = PermissionField
