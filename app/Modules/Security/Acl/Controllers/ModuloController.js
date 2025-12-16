'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ModuloRepository = use('App/Modules/Security/Acl/Repositories/ModuloRepository')
const ModuloService = use('App/Modules/Security/Acl/Services/ModuloService')
const ModuloSubModuloRepository = use('App/Modules/Security/Acl/Repositories/ModuloSubModuloRepository')
const ModuloRoleRepository = use('App/Modules/Security/Acl/Repositories/ModuloRoleRepository')
const PermissionRepository = use('App/Modules/Security/Acl/Repositories/PermissionRepository')
const PermissionRoleRepository = use('App/Modules/Security/Acl/Repositories/PermissionRoleRepository')
const Database = use("Database")
/**
 * @author mavipela@gmail.com
 * @linkedin https://www.linkedin.com/in/matondo-vicente-quela-4a331a11b/
 * Resourceful controller for interacting with Modulos
 */
class ModuloController {

  #ModuloRepo;
  #moduloService;
  subModulos;
  #ModuloSubModuloRepo;
  #ModuloRoleRepo
  #PermissionRoleRepo
  #PermissionRepo

  constructor() {
    this.#ModuloRepo = new ModuloRepository()
    this.#moduloService = new ModuloService()
    this.#ModuloSubModuloRepo = new ModuloSubModuloRepository()
    this.#ModuloRoleRepo = new ModuloRoleRepository()
    this.#PermissionRoleRepo = new PermissionRoleRepository()
    this.#PermissionRepo = new PermissionRepository();
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
    const idsModulosSubModulo = await this.#ModuloSubModuloRepo.findAll().where("is_deleted", false).fetch()
    let query = this.#ModuloRepo.findAll(search, options).with("subModulos");
    let data = await (options.isPaginate ? query.where("is_deleted", false).paginate(options.page, (options.perPage || 10)) : query.fetch());
    data = data.toJSON()
    data.data.forEach(cada => {
      if (!cada.is_principal)
        cada["idsModulosSubModulo"] = idsModulosSubModulo.toJSON().filter(function (ms) {
          return ms.submodulo_id == cada.id;
        })
      else
        cada["idsModulosSubModulo"] = idsModulosSubModulo.toJSON().filter(function (ms) {
          return ms.modulo_id == cada.id;
        })

    })
    // data= await this.preencherSubModulos(data.data)
    return response.ok(data);
  }



  async preencherSubModulos(modulos) {

    for (let modulo of modulos) {
      let subModulos1 = modulo.subModulos
      for (let subModulos2 of subModulos1) {
        if (subModulos2.subModulosSubModulos.length > 0) {
          subModulos2["subModulos"] = await this.#moduloService.pegarSubModulos(subModulos2.id);
          if (subModulos2.subModulosSubModulos.length > 0) {
            subModulos1 = subModulos2["subModulosSubModulos"]
          }
        }
      }
    }

    return modulos;
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
    try {
      const createdPayload = request.all();
      const isCreated = await this.#moduloService.isCreated(createdPayload)
      if (isCreated)
        return response.badRequest("", { message: 'Já existe módulo cadastrado com os dados inseridos' });

      const modulo_ids = createdPayload["modulo_id"];
      const ordemModuloSubModulo = createdPayload["ordemModuloSubModulo"];

      delete createdPayload["modulo_id"];
      delete createdPayload["idsModulosSubModulo"];
      delete createdPayload["ordemModuloSubModulo"];

      if (createdPayload.permission_id == null) {
        const permissionCreatedId = await this.#PermissionRepo.criarPermissao(createdPayload);
        createdPayload["permission_id"] = permissionCreatedId
      } else {
        if (createdPayload.permission_id >0) {
          const dadosAActualizar = { type_permission: "M" }
          const data = await this.#PermissionRepo.update(createdPayload.permission_id, dadosAActualizar);
        }
      }

      const data = await this.#ModuloRepo.create(createdPayload);

      if (!createdPayload.is_principal) {
        await this.#moduloService.associarModuloAoSubModulo(data, modulo_ids, ordemModuloSubModulo);
      } else {
        await this.#moduloService.associarSubModuloAoModuloPrincipal(data, modulo_ids, ordemModuloSubModulo);
      }

      return response.created(data, { message: 'registo inserido com sucesso' });
    } catch (error) {
      console.log("error:" + error)
    }
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
    const data = await this.#ModuloRepo.findById(params.id);
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
    if (await this.#moduloService.isCreatedOnUpdated(updatedPayload, params.id)) {
      return response.badRequest("", { message: 'Já existe módulo/submódulo cadastrado com os dados inseridos' });
    }

    await this.#moduloService.manipularModuloSubModuloAoActualizar(updatedPayload, params.id);

    delete updatedPayload["modulo_id"];
    delete updatedPayload["idsModulosSubModulo"];
    delete updatedPayload["ordemModuloSubModulo"];

    
    if (updatedPayload["permission_id"] === null) {
      const permissionCreatedId = await this.#PermissionRepo.criarPermissao(updatedPayload);
      updatedPayload["permission_id"] = permissionCreatedId
    }else {
      if (updatedPayload.permission_id >0) {
        const dadosAActualizar = { type_permission: "M" }
        const data = await this.#PermissionRepo.update(updatedPayload.permission_id, dadosAActualizar);
      }
    }

    const data = await this.#ModuloRepo.update(id, updatedPayload);

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
    const data = await this.#ModuloRepo.delete(params.id);
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
  async associarModuloPermissaoAoPerfil({ request, response }) {
    const { ...createdPayload } = request.all();

    await this.#moduloService.associarModuloPermissaoAoPerfil(createdPayload);

    return response.created(null, { message: 'Operação feita com sucesso' });
  }




}

module.exports = ModuloController
