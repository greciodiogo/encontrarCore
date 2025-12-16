'use strict'

class AuthenticateUser {
  get rules () {
    return {
      email: 'required|email',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {
      'email.required': 'E-mail é obrigatório!',
      'email.email': 'Introduza um e-mail válido!',
      'password.required': 'Senha é obrigatória!',
      'password.min': 'Senha muito pequena!',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = AuthenticateUser
