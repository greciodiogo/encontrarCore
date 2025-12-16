'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const EmpresaConfigRepository = use('App/Modules/Utilitarios/Repositories/EmpresaConfigRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with EmpresaConfigs
 */
class EmpresaConfigController {

 #EmpresaConfigRepo;

  constructor() {
      this.#EmpresaConfigRepo = new EmpresaConfigRepository()
  }


  /**
   * Show a list of all EmpresaConfigs.
   * GET EmpresaConfigs
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
      const search = request.input("search");
      const options = {
        page: request.input("page") || 1,
        perPage: request.input("perPage") || 5,
        orderBy: request.input("orderBy") || "id",
        typeOrderBy: request.input("typeOrderBy") || "DESC",
        searchBy: ["id"],
        isPaginate: false
      };
      let  query = this.#EmpresaConfigRepo.findAll(search, options)
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.first());
     return response.ok(data);
  }

  /**
   * Create/save a new EmpresaConfig.
   * POST EmpresaConfigs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#EmpresaConfigRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single EmpresaConfig.
   * GET EmpresaConfigs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#EmpresaConfigRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update EmpresaConfig details.
   * PUT or PATCH EmpresaConfigs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#EmpresaConfigRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a EmpresaConfig with id.
   * DELETE EmpresaConfigs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#EmpresaConfigRepo.delete(params.id);
    return response.ok(data);
  }

  /***
   * Upload logotipo
   */
  async upload({ params, request, response }) {
    const updatedPayload = request.only(['logotipo','width','height']);
    const id = params.id;
    const data = await this.#EmpresaConfigRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }
}

module.exports = EmpresaConfigController
