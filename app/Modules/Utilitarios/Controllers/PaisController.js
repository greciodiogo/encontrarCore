'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PaisRepository = use('App/Modules/Utilitarios/Repositories/PaisRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Paiss
 */
class PaisController {

 #PaisRepo;

  constructor() {
      this.#PaisRepo = new PaisRepository()
  }


  /**
   * Show a list of all Paiss.
   * GET Paiss
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
      let  query = this.#PaisRepo.findAll(search, options)
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Pais.
   * POST Paiss
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const createdPayload = request.all();
    const data = await this.#PaisRepo.create(createdPayload);
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Pais.
   * GET Paiss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#PaisRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Pais details.
   * PUT or PATCH Paiss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#PaisRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a Pais with id.
   * DELETE Paiss/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#PaisRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = PaisController

