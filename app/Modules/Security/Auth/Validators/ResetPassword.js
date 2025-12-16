'use strict'

class ResetPassword {
  get rules () {
    const password = this.ctx.request.input('password')
    return {
      old_password: 'required',
      password: 'required|min:8',
      password_confirmation: `required|equals:${password}`
    }
  }

  get messages () {
    return {
      'password_confirmation.equals': 'Palavra passe diferente!'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = ResetPassword
