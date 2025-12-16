'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ProvinciaRepository = use('App/Modules/Utilitarios/Repositories/ProvinciaRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Provincias
 */
class ProvinciaController {

 #ProvinciaRepo;

  constructor() {
      this.#ProvinciaRepo = new ProvinciaRepository()
  }


  /**
   * Show a list of all Provincias.
   * GET Provincias
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
      let  query = this.#ProvinciaRepo.findAll(search, options)
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Provincia.
   * POST Provincias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const createdPayload = request.all();
    const data = await this.#ProvinciaRepo.create(createdPayload);
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Provincia.
   * GET Provincias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#ProvinciaRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Provincia details.
   * PUT or PATCH Provincias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#ProvinciaRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a Provincia with id.
   * DELETE Provincias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#ProvinciaRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = ProvinciaController
