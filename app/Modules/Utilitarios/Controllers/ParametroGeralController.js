'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ParametroGeralRepository = use('App/Modules/Utilitarios/Repositories/ParametroGeralRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with ParametroGerals
 */
class ParametroGeralController {

  #ParametroGeralRepo;

  constructor() {
    this.#ParametroGeralRepo = new ParametroGeralRepository()
  }


  /**
   * Show a list of all ParametroGerals.
   * GET ParametroGerals
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
      searchBy: ["id", "nome", "descricao", "valor_objecto", "valores_possiveis", "slug_area_relacionada"],
      isPaginate: request.input("isPaginate") || 0,
      origemRequisicao: request.input("origemRequisicao") || "Utilizador"
    };
    let query = this.#ParametroGeralRepo.findAll(search, options).where(function () { if (options?.origemRequisicao == "Utilizador") this.where("utilizador_pode_editar", true) })
    const data = await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new ParametroGeral.
   * POST ParametroGerals
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#ParametroGeralRepo.create({ ...createdPayload });
    return response.created(data, { message: 'registo inserido com sucesso' });
  }

  /**
   * Display a single ParametroGeral.
   * GET ParametroGerals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#ParametroGeralRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update ParametroGeral details.
   * PUT or PATCH ParametroGerals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#ParametroGeralRepo.update(id, updatedPayload);
    return response.ok(data, { message: 'Registo actualizado com sucesso', data: data });
  }

  /**
   * Delete a ParametroGeral with id.
   * DELETE ParametroGerals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#ParametroGeralRepo.delete(params.id);
    return response.ok(data);
  }


}

module.exports = ParametroGeralController
