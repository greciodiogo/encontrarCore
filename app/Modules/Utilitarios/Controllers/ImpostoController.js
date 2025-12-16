'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ImpostoRepository = use('App/Modules/Utilitarios/Repositories/ImpostoRepository')
const IsentoRepository = use('App/Modules/Utilitarios/Repositories/IsentoRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Impostos
 */
class ImpostoController {

 #ImpostoRepo;
 #IsentoRepo;

  constructor() {
      this.#ImpostoRepo = new ImpostoRepository();
      this.#IsentoRepo = new IsentoRepository();
  }


  /**
   * Show a list of all Impostos.
   * GET Impostos
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
      let  query = this.#ImpostoRepo.findAll(search, options)
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Imposto.
   * POST Impostos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();

    if(createdPayload.tipo == 'ISE'){
      const isento = await this.#IsentoRepo.findById(createdPayload.isento_id).first();
      createdPayload.codigo = isento.codigo;
      createdPayload.descricao = isento.motivo_isencao;
    }
    delete createdPayload.tipo;
    const data = await this.#ImpostoRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Imposto.
   * GET Impostos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#ImpostoRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Imposto details.
   * PUT or PATCH Impostos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    if(updatedPayload.tipo == 'ISE'){
      const isento = await this.#IsentoRepo.findById(updatedPayload.isento_id).first();
      updatedPayload.codigo = isento.codigo;
      updatedPayload.descricao = isento.motivo_isencao;
    }
    delete updatedPayload.tipo;
    const data = await this.#ImpostoRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a Imposto with id.
   * DELETE Impostos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#ImpostoRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = ImpostoController
