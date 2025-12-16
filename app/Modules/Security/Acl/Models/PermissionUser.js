'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')

class PermissionUser extends Model {
  static get table(){
    return "permission_user"
  }

  static get connection() {
      return this.useConnection !== "undefined" ? this.useConnection : config.get('database.connection')
    }

    static setUseConnection(access) {
      return access
    }
}

module.exports = PermissionUser
