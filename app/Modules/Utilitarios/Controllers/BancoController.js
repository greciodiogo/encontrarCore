'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BancoRepository = use('App/Modules/Utilitarios/Repositories/BancoRepository')
const BancoService = use('App/Modules/Utilitarios/Services/BancoService')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Bancos
 */
class BancoController {

 #BancoRepo;
 #BancoServ;

  constructor() {
      this.#BancoRepo = new BancoRepository()
      this.#BancoServ = new BancoService()
  }


  /**
   * Show a list of all Bancos.
   * GET Bancos
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
      let banco_list = await this.#BancoServ.findAll(search,options);
     return response.ok(banco_list);
  }

  /**
   * Create/save a new Banco.
   * POST Bancos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#BancoServ.create(createdPayload,auth.user.id);
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Banco.
   * GET Bancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#BancoServ.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Banco details.
   * PUT or PATCH Bancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const updatedPayload = request.all();
    const data = await this.#BancoServ.update(params.id, updatedPayload);
    return response.ok(data, {message:'Registo actualizado com sucesso', data: data});
  }

  /**
   * Delete a Banco with id.
   * DELETE Bancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#BancoServ.delete(params.id);
    return response.ok(data);
  }
}

module.exports = BancoController
