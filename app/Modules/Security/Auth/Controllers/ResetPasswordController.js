'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const NotUpdateException = use("App/Exceptions/NotUpdateException");
const ResetPasswordService = use('App/Modules/Security/Auth/Services/ResetPasswordService');
/**
 * Resourceful controller for interacting with resetpasswords
 */
class ResetPasswordController { 
  #ResetPasswordService;
  constructor() {
    this.#ResetPasswordService = new ResetPasswordService();
  }
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

  async recoverPasswordSendingEmail({ request, response, auth }) {
    const email = request.input('email');
    const link = request.input('link');
    const data = await this.#ResetPasswordService.SendEmailRecoverPassword(email,link);
    return response.created(data, { message: 'Será enviado Um link para redefinir a palavra-passe a este email : '+data.email});
  } 

  async resetPassword({ request, response, auth,params }) {
    const password = request.input('password');
    const token = params.token;
    const data = await this.#ResetPasswordService.resetPassword(token,password);
    return response.created(data, { message: 'Palavra-passe Alterada com sucesso!'});
  } 

  async updatePassword ({ request, auth, response }) {
    const Persona = use("Persona");   
      const payload = request.only(['old_password', 'password', 'password_confirmation'])
      const user = auth.user
      const result = await Persona.updatePassword(user, payload)
      return response.ok(result, {message:'Senha alterada com sucesso.'});

  }

  
  async verificToken({ request, response, auth }) {
    const token = request.input('token');
    const data =  await this.#ResetPasswordService.verificToken(token);
    return data;
  }
  
}

module.exports = ResetPasswordController
