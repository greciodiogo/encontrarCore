'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class FileNotFoundException extends LogicalException {

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
      message: this.#message || 'Ficheiro Não encontrado'
    })
  }

}

module.exports = FileNotFoundException
