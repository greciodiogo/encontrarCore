'use strict'

class AuthenticateUser {
  get rules () {
    return {
      username: 'required',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {
      'username.required': 'Username é obrigatório!', 
      'password.required': 'Senha é obrigatória!',
      'password.min': 'Senha muito pequena!',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = AuthenticateUser
