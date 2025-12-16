'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DocumentoRepository = use('App/Modules/Utilitarios/Repositories/DocumentoRepository')

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Documentos
 */
class DocumentoController {

 #DocumentoRepo;

  constructor() {
      this.#DocumentoRepo = new DocumentoRepository()
  }


  /**
   * Show a list of all Documentos.
   * GET Documentos
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
      let  query = this.#DocumentoRepo.findAll(search, options)
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Documento.
   * POST Documentos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#DocumentoRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Documento.
   * GET Documentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#DocumentoRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Documento details.
   * PUT or PATCH Documentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#DocumentoRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a Documento with id.
   * DELETE Documentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#DocumentoRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = DocumentoController


module.exports = DocumentoController
