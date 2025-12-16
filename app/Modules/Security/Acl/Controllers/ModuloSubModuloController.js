'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ModuloSubModuloRepository = use('App/Modules/Security/Acl/Repositories/ModuloSubModuloRepository')

/**
 * @author mavipela@gmail.com
 * @linkedin https://www.linkedin.com/in/matondo-vicente-quela-4a331a11b/
 * Resourceful controller for interacting with Modulos
 */
class ModuloSubModuloController {

  #ModuloSubModuloRepo;

  constructor() {
    this.#ModuloSubModuloRepo = new ModuloSubModuloRepository()
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
    let query = this.#ModuloSubModuloRepo.findAll(search, options)
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
    const data = await this.#ModuloSubModuloRepo.create(createdPayload);
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
    const data = await this.#ModuloSubModuloRepo.findById(params.id);
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
    const data = await this.#ModuloSubModuloRepo.update(id, updatedPayload);
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
    const data = await this.#ModuloSubModuloRepo.delete(params.id);
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
  async attachOrDetachSubModulosToModulo({ request, response, auth }) {
    let { ...dataPayload } = request.all();
    console.log("dataPayload:"+JSON.stringify(dataPayload))
    const subModulos = dataPayload.submodulo_id
    if (dataPayload.accao.toUpperCase() == "ADICIONAR") {
      delete dataPayload["accao"];
      for (let subModulo_id of subModulos){
        dataPayload["submodulo_id"]=subModulo_id
        await this.#ModuloSubModuloRepo.create(dataPayload);
      }
    } else {
      delete dataPayload["accao"];
      for (let subModulo_id of subModulos){
        let moduloSubModulo = await this.#ModuloSubModuloRepo.getModuloSubModuloByModulo(dataPayload.modulo_id, subModulo_id)
        await this.#ModuloSubModuloRepo.delete(moduloSubModulo.id);
      }
    }
    return response.created(null, { message: 'Operação efectuada com sucesso' });
  }
}

module.exports = ModuloSubModuloController
