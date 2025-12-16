'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const Logger = require('../Helpers/Logger')

class InternalServerException extends LogicalException {
  constructor (message) {
    super(message);
    this.message = message
  }

  /**
   * Handle this exception by itself
   */
  async handle(error, { request, response }) {
    // Logger.register('error', error, request)
    response.internalServer(null, {
      message: this.message
    })
  }
}

module.exports = InternalServerException
