'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const NotUpdateException = use("App/Exceptions/NotUpdateException");
/**
 * Resourceful controller for interacting with resetpasswords
 */
class ResetPasswordController { 
  /**
   * Create/save a new resetpassword.
   * POST resetpasswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async resetPassword({ request, response, auth }) {
    const Persona = use("Persona");    
    const payload = request.only(["old_password","password","password_confirmation"]);
    //try {
      const user = auth.user;
      await Persona.updatePassword(user, payload); 
      return response.created(null, {message:'Senha alterada com sucesso.'});
    /*} catch (e) {
      throw new NotUpdateException('Falha na Aleração da Senha, Verifica as senhas digitadas se correspondem');  
    }*/
  } 
}

module.exports = ResetPasswordController
