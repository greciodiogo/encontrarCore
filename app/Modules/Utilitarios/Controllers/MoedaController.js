"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const MoedaRepository = use("App/Modules/Utilitarios/Repositories/MoedaRepository");

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Moedas
 */
class MoedaController {
  #MoedaRepo;

  constructor() {
    this.#MoedaRepo = new MoedaRepository();
  }

  /**
   * Show a list of all Moedas.
   * GET Moedas
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id"],
      isPaginate: true,
    };
    let query = this.#MoedaRepo.findAll(search, options);
    const data = await (options.isPaginate
      ? query.paginate(options.page, options.perPage || 10)
      : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new Moeda.
   * POST Moedas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const createdPayload = request.all();

    console.log(createdPayload);
    const data = await this.#MoedaRepo.create({
      ...createdPayload,
      user_id: auth.user.id,
    });
    return response.created(data, { message: "registo inserido com sucesso" });
  }

  /**
   * Display a single Moeda.
   * GET Moedas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#MoedaRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Moeda details.
   * PUT or PATCH Moedas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#MoedaRepo.update(id, updatedPayload);
    return response.ok(data, {
      message: "successfully updated object",
      data: data,
    });
  }

  /**
   * Delete a Moeda with id.
   * DELETE Moedas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#MoedaRepo.delete(params.id);
    return response.ok(data);
  }
}
module.exports = MoedaController;
