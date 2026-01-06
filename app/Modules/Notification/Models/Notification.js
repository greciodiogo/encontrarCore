'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Notification extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Auditable");
  }

  static get table () {
    return 'notifications'
  }

  static get createdAtColumn() {
    return 'createdAt'
  }

  static get updatedAtColumn() {
    return null // Não há coluna de update
  }

  static get fillable() {
    return ['user_id', 'userId', 'title', 'message', 'type', 'isRead', 'data']
  }
}

module.exports = Notification
