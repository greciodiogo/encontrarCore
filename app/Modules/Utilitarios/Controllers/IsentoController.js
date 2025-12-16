'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const IsentoService = use('App/Modules/Utilitarios/Services/IsentoService')
/**
 * Resourceful controller for interacting with isentos
 */
class IsentoController {
  #IsentoServ;

  constructor() {
    this.#IsentoServ = new IsentoService()
  }
  /**
   * Show a list of all isentos.
   * GET isentos
   *
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
      searchBy: ["id","codigo","motivo_isencao"],
      isPaginate: true
    };
    let lista_isentos = await this.#IsentoServ.findAll(search,options);
   return response.ok(lista_isentos);
}

/**
 * Create/save a new Conta Bancaria.
 * POST Bancos
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response, auth }) {
  const createdPayload = request.all();
  const data = await this.#IsentoServ.create(createdPayload,auth.user.id);
  return response.created(data, {message:'registo inserido com sucesso'});
}

/**
 * Display a single Contas Bancarias.
 * GET Bancos/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, response }) {
  const data = await this.#IsentoServ.findById(params.id);
  return response.ok(data);
}

/**
 * Update Conta Bancaria details.
 * PUT or PATCH ContaBancaria/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
  const updatedPayload = request.all();
  const data = await this.#IsentoServ.update(params.id, updatedPayload);
  return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
}

/**
 * Delete a Conta Bancaria with id.
 * DELETE Conta Bancaria/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, response }) {
  const data = await this.#IsentoServ.delete(params.id);
  return response.ok(data);
}
}

module.exports = IsentoController
