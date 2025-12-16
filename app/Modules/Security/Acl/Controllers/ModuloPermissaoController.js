'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ModuloPermissaoRepository = use('App/Modules/Security/Acl/Repositories/ModuloPermissaoRepository')

/**
 * @author mavipela@gmail.com
 * @linkedin https://www.linkedin.com/in/matondo-vicente-quela-4a331a11b/
 * Resourceful controller for interacting with Modulos
 */
class ModuloPermissaoController {

  #ModuloPermissaoRepo;

  constructor() {
    this.#ModuloPermissaoRepo = new ModuloPermissaoRepository()
  }


  /**
   * Show a list of all Modulos.
   * GET Modulos
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
      searchBy: ["id", "nome"],
      isPaginate: true
    };
    let query = this.#ModuloPermissaoRepo.findAll(search, options)
    const data = await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new Modulo.
   * POST Modulos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const createdPayload = request.all();
    const data = await this.#ModuloPermissaoRepo.create(createdPayload);
    return response.created(data, { message: 'registo inserido com sucesso' });
  }

  /**
   * Display a single Modulo.
   * GET Modulos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#ModuloPermissaoRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Modulo details.
   * PUT or PATCH Modulos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const data = await this.#ModuloPermissaoRepo.update(id, updatedPayload);
    return response.ok(data, { message: 'Registo actualizado com sucesso', data: data });
  }

  /**
   * Delete a Modulo with id.
   * DELETE Modulos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#ModuloPermissaoRepo.delete(params.id);
    return response.ok(data);
  }

  /**
   * attachOrDetachPermissionsToModulo a Permission with id.
   * DELETE Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async attachOrDetachPermissionsToModulo({ request, response, auth }) {
    const { ...dataPayload } = request.all();
    // console.log("dataPayload:" + JSON.stringify(dataPayload))
    if (dataPayload.accao.toUpperCase() == "ADICIONAR") {
      delete dataPayload["accao"];
      for (let permissao of dataPayload.permissao_id) {
        dataPayload["permissao_id"] = permissao
        await this.#ModuloPermissaoRepo.create(dataPayload);
      }
    } else {
      delete dataPayload["accao"];
      for (let permissao of dataPayload.permissao_id) {
        const moduloPermissao = await this.#ModuloPermissaoRepo.getModuloPermissaoByModulo(dataPayload.modulo_id, permissao)
        await this.#ModuloPermissaoRepo.delete(moduloPermissao.id);
      }

    }
    return response.created(null, { message: 'Operação efectuada com sucesso' });
  }
}

module.exports = ModuloPermissaoController
