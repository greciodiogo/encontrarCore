'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const SerieRepository = use('App/Modules/Utilitarios/Repositories/SerieRepository')
const Database = use("Database");

/**
 * @author caniggiamoreira@gmail.com
 * @linkedin https://www.linkedin.com/in/caniggia-moreira-8a945999/
 * Resourceful controller for interacting with Series
 */
class SerieController {

 #SerieRepo;

  constructor() {
      this.#SerieRepo = new SerieRepository()
  }


  /**
   * Show a list of all Series.
   * GET Series
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
        typeFilter: request.input('typeFilter') || '',
        documento_id: request.input("documento_id") || '',
        data: request.input("data") || null,
        estado: request.input("estado") || '',
        searchBy: [],
        withRalationships: ["documento", "armazem"],
        isPaginate: true,
      };
      let  query = this.#SerieRepo.findAll(search, options).with('documento')
      .where(function () {
        if (
          options.data &&
          options.data != "undefined" 
         
        ) {
          this.where(
            Database.raw('DATE_FORMAT(created_at, "%Y-%m-%d")'),
            options.data
          );
        }
        if (options.documento_id) {
          this.where('documento_id', options.documento_id)
        }
        if (options.estado !='') {          
          this.where('estado', options.estado)
        }
        if (options.typeFilter == 'doc_sigla' && search != '') {
          this.whereIn("documento_id", Database.select('id').from('documentos').where('sigla', search))
        }
        if (options.typeFilter == 'serie' && search != '') {
          this.where('nome', search)
        }
      })
      const data =  await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
     return response.ok(data);
  }

  /**
   * Create/save a new Serie.
   * POST Series
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const createdPayload = request.all();
    const data = await this.#SerieRepo.create({...createdPayload, user_id: auth.user.id});
    return response.created(data, {message:'registo inserido com sucesso'});
  }

  /**
   * Display a single Serie.
   * GET Series/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const data = await this.#SerieRepo.findById(params.id);
    return response.ok(data);
  }


  async findSeriesRecibosNotInLojas ({ params, response }) {
    const data = await this.#SerieRepo.findSeriesRecibosNotInLojas();
    return response.ok(data);
  }

  async findSeriesNotInLojas ({ params, response }) {
    const data = await this.#SerieRepo.findSeriesNotInLojas();
    return response.ok(data);
  }


  async findEstadoSerieById ({ params, response }) {
    const data = await this.#SerieRepo.findEstadoSerie(params.id);
    return response.ok(data);
  }
  /**
   * Update Serie details.
   * PUT or PATCH Series/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#SerieRepo.update(id, updatedPayload);
    return response.ok(data, {message:'successfully updated object', data: data});
  }

  /**
   * Delete a Serie with id.
   * DELETE Series/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const data = await this.#SerieRepo.delete(params.id);
    return response.ok(data);
  }
}

module.exports = SerieController


module.exports = SerieController
