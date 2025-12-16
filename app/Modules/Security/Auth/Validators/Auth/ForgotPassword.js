'use strict'

class ForgotPassword {
  get rules () {
    return {
      email: 'required|email'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = ForgotPassword
