'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotForbiddenException extends LogicalException {

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
    response.forbidden(null, {
      message: this.#message || 'Acesso Negado, Não tem permissão para executar esta operação.'
    })
  }
}

module.exports = NotForbiddenException
