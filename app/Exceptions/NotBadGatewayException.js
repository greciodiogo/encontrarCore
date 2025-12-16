'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotBadGatewayException extends LogicalException {


  constructor (message) {
    super(message)
    this.message = message
  }
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.BadGateway(null, {
      message: this.message || `Erro de ligação. Por favor tente novamente`
    })
  }

}

module.exports = NotBadGatewayException
