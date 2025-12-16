'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use("Helpers");
const path2 = require('path');
const barra_so = path2.sep;

class Controller extends Command {

  static get signature () {
    return `make:controller2
        { name: Name of the user to controllers}
        { --m=@value : Define a custom module to be used  }
      `}
 
  static get description () {
    return `create  app${barra_so}Controllers`;
  }
  async handle (args, flags) { 
    
    const controllers = args.name;
    const module = flags.m  || "";
    const path = `app${barra_so}Modules${barra_so}${module}${barra_so}Controllers${barra_so}${controllers}Controller.js`;
    const exists = await this.pathExists(path); 
    if (exists) {
      this.error(`${Helpers.appRoot()}${barra_so}${path} already exists`)
    }else{
      this.generateFile(path,this.content(controllers,module));
      this.success(`${this.iconsMain.success} create ${path}`)
    }
    
  }

  content(controllers, module) {
    return`
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ${controllers}Service = use('App/Modules/${module}/Services/${controllers}Service')
/**
 * Resourceful controller for interacting with icttrunkouts
 */
class ${controllers}Controller{
  /**
   * Show a list of all icttrunkouts.
   * GET icttrunkouts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   
   */
  async index ({ request, response,  }) { 
    const filters = request;
    const data = await new ${controllers}Service().findAll${controllers}s(filters);
    return response.ok(data);
  } 
  /**
   * Create/save a new icttrunkout.
   * POST icttrunkouts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const ModelPayload = request.all();
    const UserId = auth.user.id;
    const data = await new ${controllers}Service().created${controllers}s({...ModelPayload}, UserId);
    return response.created(data, {message: "Registo efectuado com sucesso"});
  }

  /**
   * Display a single icttrunkout.
   * GET icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   
   */
  async show ({ params, response  }) {
    const Id = params.id;
    const data = await new ${controllers}Service().find${controllers}ById(Id);
    return response.ok(data);
  }

  /**
   * Update icttrunkout details.
   * PUT or PATCH icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const ModelPayload = request.all();
    const Id = params.id;
    const data = await new ${controllers}Service().updated${controllers}(Id, ModelPayload);
    return response.ok(data, {message: "Registo actualizado com sucesso"});
  }

  /**
   * Delete a icttrunkout with id.
   * DELETE icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) { 
    const Id = params.id;
    const data = await new ${controllers}Service().deleteTemporarily${controllers}(Id);
    return response.ok(data, {message: "Registo excluido com sucesso"});
  }
}

module.exports = ${controllers}Controller
    `
  }

  methods(controllers){
    return `
    `
  }
}


module.exports = Controller
