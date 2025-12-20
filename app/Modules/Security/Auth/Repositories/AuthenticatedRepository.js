"use strict";
const User = use("App/Modules/Security/Users/Models/User");
const Hash = use('Hash');

class AuthenticatedRepository {
  constructor() { }
  /**
   * Authenticate user with email and password
   * @param {Object} request - request object
   * @param {Object} auth - auth object
   * @param {Object} response - response object
   */
  async authenticate(request, auth, response) {
    const { email, password } = request.all();
    try {
      
      // Verificar se utilizador existe
      const userExists = await User.findBy("email", email);
      if (userExists) {
        
      }
      
      const token = await auth
        .withRefreshToken()
        .attempt(email, password);

      const user = await User.findBy("email", email);
      const userData = user.toJSON();
      
      delete userData.password;
      delete userData.created_at;
      delete userData.updated_at;

      const dadosUtilizadorLogado = { user: userData, token: token };

      return response.ok(
        dadosUtilizadorLogado,
        {
          message: `Seja Bem-vindo Sr(a) ${userData.name}`,
        }
      );
    } catch (e) {
      console.log('Auth error:', e.message);
      return response.unauthorized(null, {
        title: "Falha na Autenticação",
        message:
          "Email ou Password Inválido, ou consulta o administrador para verificar se a sua conta está activa",
      });
    }
  }


  /**
   * Logout user
   * @param {Object} auth - auth object
   * @param {Object} request - request object
   */
  async logout(auth, request) {
    try {
      const check = await auth.check();
      if (check) {
        await auth.logout();
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}

module.exports = AuthenticatedRepository;
