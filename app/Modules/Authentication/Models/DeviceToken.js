'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DeviceToken extends Model {
  static boot() {
    super.boot()
    this.addTrait("@provider:Auditable");
  }

  static get table() {
    return 'device_tokens'
  }

  // Relacionamentos
  user() {
    return this.belongsTo('App/Modules/Authentication/Models/User')
  }

  static get fillable() {
    return ['user_id', 'token', 'device_name', 'device_type', 'is_active']
  }

  static get hidden() {
    return []
  }

  static get dates() {
    return ['created_at', 'updated_at']
  }
}

module.exports = DeviceToken