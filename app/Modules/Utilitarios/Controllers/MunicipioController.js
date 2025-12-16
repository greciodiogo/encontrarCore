'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const MunicipioRepository = use('App/Modules/Utilitarios/Repositories/MunicipioRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Municipios
 */
class MunicipioController {

 #MunicipioRepo;

  constructor() {
      this.#MunicipioRepo = new MunicipioRepository()
  }


  /**
   * Show a list of all Municipios.
   * GET Municipios
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
        isPaginate: true
      };
      let query = this.#MunicipioRepo.findAll(search, options).with("provincia");
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Municipio.
   * POST Municipios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#MunicipioRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Municipio.
   * GET Municipios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#MunicipioRepo.findById(params.id).first();
    return response.ok(data);
  }

  /**
   * Update Municipio details.
   * PUT or PATCH Municipios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#MunicipioRepo.update(id, updatedPayload);
    return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
  }

  /**
   * Delete a Municipio with id.
   * DELETE Municipios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#MunicipioRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = MunicipioController
