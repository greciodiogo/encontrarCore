'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
    static boot () {
        super.boot()
        this.addTrait('@provider:Auditable')
      }
    static get traits () {
        return [
          '@provider:Adonis/Acl/HasPermission'
        ]
      }

      static get connection() {
        return this.useConnection !== "undefined" ? this.useConnection : config.get('database.connection')
      }
  
      static setUseConnection(access) {
        return access
      }
      
      static get table () {
        return 'roles'
      }

      direccao() {
        return this.belongsTo("App/Modules/CRM/Models/Direccao").select("id", "designacao");
      }
    
}

module.exports = Role
