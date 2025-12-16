"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const CambioRepository = use("App/Modules/Utilitarios/Repositories/CambioRepository");
/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Cambios
 */
class CambioController {
  #CambioRepo;

  constructor() {
    this.#CambioRepo = new CambioRepository();
  }

  /**
   * Show a list of all Cambios.
   * GET Cambios
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const search = request.input("search");
    const options = {
      moeda_id: request.input("moeda_id"),
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id"],
      isPaginate: true,
    };
    let query = this.#CambioRepo.findAll(search, options).where('moeda_id',options.moeda_id)
    const data = await (options.isPaginate
      ? query.paginate(options.page, options.perPage || 10)
      : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new Cambio.
   * POST Cambios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const createdPayload = request.all();
    console.log(createdPayload.is_actived);

    if (createdPayload.is_actived == true) {
      await this.#CambioRepo.model.query().where('moeda_id',createdPayload.moeda_id).where("is_actived", true).update({ is_actived: false });
    }
    const data = await this.#CambioRepo.create({
      ...createdPayload,
      user_id: auth.user.id,
    });
    return response.created(data, { message: "registo inserido com sucesso" });
  }

  /**
   * Display a single Cambio.
   * GET Cambios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#CambioRepo.findById(params.id).first();
    return response.ok(data);
  }

  /**
   * Update Cambio details.
   * PUT or PATCH Cambios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#CambioRepo.update(id, updatedPayload);
    return response.ok(data, {
      message: "Registo actualizado com sucesso",
      data: data,
    });
  }

  /**
   * Delete a Cambio with id.
   * DELETE Cambios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#CambioRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = CambioController;
