'use strict'

class ShopStatus {
  get rules() {
    return {
      'status': 'required|in:PAUSED,MANUALLY_CLOSED'
    }
  }

  get messages() {
    return {
      'status.required': 'O campo status é obrigatório',
      'status.in': 'O status deve ser PAUSED ou MANUALLY_CLOSED'
    }
  }
}

module.exports = ShopStatus
