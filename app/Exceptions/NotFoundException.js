'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  #message
  constructor (message) {
    super(message)
    this.#message = message
  }
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.notFound(null, {
      message: this.#message || 'Cannot find it.'
    })
  }
}

module.exports = NotFoundException
