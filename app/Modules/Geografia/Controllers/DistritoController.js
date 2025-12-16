'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DistritoRepository = use('App/Modules/Geografia/Repositories/DistritoRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Distritos
 */
class DistritoController {

 #DistritoRepo;

  constructor() {
      this.#DistritoRepo = new DistritoRepository()
  }


  /**
   * Show a list of all Distritos.
   * GET Distritos
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
      let query = this.#DistritoRepo.findAll(search, options).with("municipio");
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Distrito.
   * POST Distritos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#DistritoRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Distrito.
   * GET Distritos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#DistritoRepo.findById(params.id).first();
    return response.ok(data);
  }

  /**
   * Update Distrito details.
   * PUT or PATCH Distritos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#DistritoRepo.update(id, updatedPayload);
    return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
  }

  /**
   * Delete a Distrito with id.
   * DELETE Distritos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#DistritoRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = DistritoController
