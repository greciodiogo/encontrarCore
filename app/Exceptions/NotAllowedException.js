'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotAllowedException extends LogicalException {

  #message
  constructor (message) {
    super(message)
    this.#message = message
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
  handle (error, { response }) {
    response.unauthorized(null, {
      message: this.#message || 'Acesso Negado, Não tem permissão para executar esta operação.'
    })
  }
}

module.exports = NotAllowedException
