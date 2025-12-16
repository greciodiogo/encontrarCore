'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotUpdateException extends LogicalException {

  #message
  constructor (message) {
    super(message)
    this.#message = message
  }
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.badRequest(null, {
      message: this.#message || 'Não foi possível actualizar. Por favor verifique os dados de entrada.'
    })
  }

}

module.exports = NotUpdateException
