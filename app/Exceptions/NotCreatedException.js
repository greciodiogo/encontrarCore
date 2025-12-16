'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotCreatedException extends LogicalException {
  #message;
  constructor (message) {
    super(message);
    this.#message = message
  }
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) { 
    response.badRequest(null, {
      message: this.#message || 'Cannot create it.'
    })
  }
}

module.exports = NotCreatedException
