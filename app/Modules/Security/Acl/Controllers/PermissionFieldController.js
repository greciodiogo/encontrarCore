'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PermissionFieldRepository = use('App/Modules/Security/Acl/Repositories/PermissionFieldRepository')
const gearAss = use("App/Helpers/gearAss");
const encriptar = use("App/Helpers/encrypt");
const Database = use('Database')
var moment = require("moment");
/**
 * @author mavipela@gmail.com
 * @linkedin https://www.linkedin.com/in/matondo-vicente-pedro-quela-4a331a11b/
 * Resourceful controller for interacting with Permissions
 */
class PermissionFieldController {

  #PermissionRepo;

  constructor() {
    this.#PermissionRepo = new PermissionFieldRepository()
  }


  /**
   * Show a list of all Permissions.
   * GET Permissions
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, request, response, view }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["slug", "name"],
      isPaginate: true,
      filtro: request.input("search"),
      typeFilter: true
    };

    let query = this.#PermissionRepo.findAll(search, options).where("is_deleted", 0)
    const data = await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
    return response.ok(data);
  }

  /**
   * Create/save a new Permission.
   * POST Permissions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    let createdPayload = request.all();
    createdPayload = {...createdPayload, key:encriptar(`${createdPayload.slug.toLowerCase()}`)}
    let data = this.#PermissionRepo.create(createdPayload);
    return response.created(data, { message: 'Registo inserido com sucesso' });
  }

  /**
   * Display a single Permission.
   * GET Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const data = await this.#PermissionRepo.findById(params.id);
    return response.ok(data);
  }

  /**
   * Update Permission details.
   * PUT or PATCH Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id;
    const updatedPayload = request.all();
    const chave = gearAss(updatedPayload.slug);
    updatedPayload["key"] = chave;

    if (await this.isCreatedOnUpdated(updatedPayload, id))
      return response.badRequest("", { message: 'Já existe permissão cadastrada com dados inseridos ' });

    const data = await this.#PermissionRepo.update(id, updatedPayload);
    return response.ok(data, { message: 'Operação feita com sucesso', data: data });
  }

  /**
   * Delete a Permission with id.
   * DELETE Permissions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const data = await this.#PermissionRepo.delete(params.id);
    return response.ok(data);
  }

  async getAllPermissionsOfUser({ params, response }) {
    const data = await this.#PermissionRepo.getAllPermissionsOfUser(params.id);
    return response.ok(data);
  }

  async isCreated(dados) {
    try {
      const data = await this.#PermissionRepo.findAll().where("name", dados.name).where("slug", dados.slug).fetch();
      return (data.length == undefined) ? false : true
    } catch (error) {
      console.log("error:" + error)
    }
  }

  async isCreatedOnUpdated(dados, id) {
    const data = await this.#PermissionRepo.findAll().where("name", dados.name).where("slug", dados.slug).whereNot("id", id).fetch();
    return (data.length == 0 || data.length == undefined) ? false : true;
  }

}

module.exports = PermissionFieldController
