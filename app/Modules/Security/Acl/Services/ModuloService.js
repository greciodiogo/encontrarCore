"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ModuloRepository = use('App/Modules/Security/Acl/Repositories/ModuloRepository')
const ModuloSubModuloRepository = use('App/Modules/Security/Acl/Repositories/ModuloSubModuloRepository')
const ModuloRoleRepository = use('App/Modules/Security/Acl/Repositories/ModuloRoleRepository')
const PermissionRoleRepository = use('App/Modules/Security/Acl/Repositories/PermissionRoleRepository')
const Database = use("Database")

class ModuloService {
  #ModuloRepo;
  #ModuloSubModuloRepo;
  #ModuloRoleRepo
  #PermissionRoleRepo

  constructor() {
    this.#ModuloRepo = new ModuloRepository();
    this.#ModuloSubModuloRepo = new ModuloSubModuloRepository()
    this.#ModuloRoleRepo = new ModuloRoleRepository()
    this.#PermissionRoleRepo = new PermissionRoleRepository()
  }

  /**
   * check if is created
   * GET Bancos
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async isCreated(dados) {
    // const data = await this.#ModuloRepo.findAll().where("nome", dados.nome).where("slug", dados.slug).where("is_deleted", false).fetch();
    const data = await this.#ModuloRepo.findAll().where("nome", dados.nome).where("is_deleted", false).fetch();
    return (data.toJSON().length > 0) ? true : false;
  }

  async isCreatedOnUpdated(dados, id) {
    // const data = await this.#ModuloRepo.findAll().where("nome", dados.nome).where("slug", dados.slug).where("is_deleted", false).where("id","!=", id).fetch();
    const data = await this.#ModuloRepo.findAll().where("nome", dados.nome).where("is_deleted", false).where("id", "!=", id).fetch();
    return (data.toJSON().length > 0) ? true : false;
  }

  async associarModuloPermissaoAoPerfil(createdPayload) {

    // Para módulos
    if (createdPayload.modulosAExcluir.length > 0)
      for (let modulo of createdPayload.modulosAExcluir) {
        const dadosVerificar = { modulo_id: modulo, role_id: createdPayload.role_id, is_deleted: false };
        const dadosActualizar = {
          is_deleted: true
        }
        await this.#ModuloRoleRepo.updateForData(dadosVerificar, dadosActualizar)
      }

    if (createdPayload.modulosAAdicionar.length > 0)
      for (let modulo of createdPayload.modulosAAdicionar) {
        const objecto = { modulo_id: modulo, role_id: createdPayload.role_id };
        await this.#ModuloRoleRepo.create(objecto);
      }

    // Para submodulos
    if (createdPayload.moduloSubModulosAAdicionar.length > 0)
      for (let modulo of createdPayload.moduloSubModulosAAdicionar) {
        const objecto = { modulo_submodulo_id: modulo, role_id: createdPayload.role_id };
        const data = await this.#ModuloRoleRepo.create(objecto);
      }

    if (createdPayload.moduloSubModulosAExcluir.length > 0)
      for (let modulo of createdPayload.moduloSubModulosAExcluir) {
        const dadosVerificar = { modulo_submodulo_id: modulo, role_id: createdPayload.role_id, is_deleted: false };
        const dadosActualizar = {
          is_deleted: true
        }
        await this.#ModuloRoleRepo.updateForData(dadosVerificar, dadosActualizar)
      }

    // Para permissoes
    if (createdPayload.permissoesAExcluir.length > 0)
      for (let permission of createdPayload.permissoesAExcluir) {
        const permissao = await Database.select("*").from("permission_role").where("permission_id", permission.permission_id).where("modulo_permissao_id", permission.modulo_permissao_id).where("role_id", createdPayload.role_id).first();
        await Database.table('permission_role').where('id', permissao.id).delete()
      }

    if (createdPayload.permissoesAAdicionar.length > 0)
      for (let permission of createdPayload.permissoesAAdicionar) {
        const objecto = { permission_id: permission.permission_id, modulo_permissao_id: permission.modulo_permissao_id, role_id: createdPayload.role_id };
        await Database.insert(objecto).into('permission_role')
      }
  }

  async pegarSubModulos(modulo_id) {
    return await this.#ModuloRepo.findAll().where("is_deleted", false).with("moduloSubModulos").where("modulo_submodulos.modulo_id", modulo_id).fetch()
  }

  async associarModuloAoSubModulo(subModuloCriado, modulo_ids, ordemModuloSubModulo) {
    for (let mod of modulo_ids) {
      const ordem = ordemModuloSubModulo.find(cada => cada.modulo_id == mod)
      let objectoACriar = {
        modulo_id: mod,
        submodulo_id: subModuloCriado.id,
        ordem: ordem ? ordem.ordem : 1
      }
      this.#ModuloSubModuloRepo.create(objectoACriar);
    };
  }

  async associarSubModuloAoModuloPrincipal(moduloCriado, modulo_ids, ordemModuloSubModulo) {
    for (let sub of modulo_ids) {
      const ordem = ordemModuloSubModulo.find(cada => cada.modulo_id == sub)
      let objectoACriar = {
        modulo_id: moduloCriado.id,
        submodulo_id: sub,
        ordem: ordem ? ordem.ordem : 1
      }
      await this.#ModuloSubModuloRepo.create(objectoACriar);
    }
  }

  async manipularModuloSubModuloAoActualizar(updatedPayload, moduloSubmodulo_id) {
    const modulosSeleccionados = updatedPayload["modulo_id"];
    const idsModulosSubModulo = updatedPayload["idsModulosSubModulo"];
    const ordemModuloSubModulo = updatedPayload["ordemModuloSubModulo"];

    const modulosAExcluir = idsModulosSubModulo.filter(x => !modulosSeleccionados.includes(x))
    if (modulosAExcluir.length > 0)
      await this.apagarModuloSubModulo(modulosAExcluir, moduloSubmodulo_id, updatedPayload.is_principal);

    const modulosAAdicionar = modulosSeleccionados.filter(x => !idsModulosSubModulo.includes(x))
    if (modulosAAdicionar.length > 0)
      await this.adicionarModuloSubModulo(modulosAAdicionar, moduloSubmodulo_id, updatedPayload.ordemModuloSubModulo, updatedPayload.is_principal);

    const modulosAActualizar = modulosSeleccionados.filter(x => idsModulosSubModulo.includes(x))
    if (modulosAActualizar.length > 0)
      await this.actualizarModuloSubModulo(modulosAActualizar, moduloSubmodulo_id, updatedPayload.ordemModuloSubModulo, updatedPayload.is_principal);

  }

  async apagarModuloSubModulo(modulosAExcluir, moduloSubmodulo_id, is_principal) {
    modulosAExcluir.forEach(modulo => {
      // const objecto = this.#ModuloSubModuloRepo.pegarPorDados(modulo, moduloSubmodulo_id);
      let dadosVerificar = {}
      let dadosActualizar = {}
      if (!is_principal) {
        dadosVerificar = {
          modulo_id: modulo,
          submodulo_id: moduloSubmodulo_id,
        }

        dadosActualizar = {
          is_deleted: true,
          modulo_id: null
        }

      } else {
        dadosVerificar = {
          modulo_id: moduloSubmodulo_id,
          submodulo_id: modulo,
        }

        dadosActualizar = {
          is_deleted: true,
          submodulo_id: null
        }
      }

      this.#ModuloSubModuloRepo.updateForData(dadosVerificar, dadosActualizar)
    });
  }

  async actualizarModuloSubModulo(modulosAActualizar, moduloSubmodulo_id, ordemModuloSubModulo, is_principal) {
    try {
      modulosAActualizar.forEach(modulo => {
        const ordem = ordemModuloSubModulo.find(cada => cada.modulo_id == modulo)
        let dadosVerificar = {}
        if (!is_principal) {
          dadosVerificar = {
            modulo_id: modulo,
            submodulo_id: moduloSubmodulo_id,
            is_deleted: false
          }
        } else {
          dadosVerificar = {
            modulo_id: moduloSubmodulo_id,
            submodulo_id: modulo,
            is_deleted: false
          }
        }

        const dadosActualizar = {
          ordem: ordem.ordem
        }

        this.#ModuloSubModuloRepo.updateForData(dadosVerificar, dadosActualizar)
      });
    } catch (error) {
      console.log("error:" + error)
    }
  }

  async adicionarModuloSubModulo(modulosAAdicionar, modulosSubmodulo_id, ordemModuloSubModulo, is_principal) {
    modulosAAdicionar.forEach(modulo => {
      let objecto = {}
      const ordem = ordemModuloSubModulo.find(cada => cada.modulo_id == modulo)
      if (!is_principal)
        objecto = { modulo_id: modulo, submodulo_id: modulosSubmodulo_id, ordem: ordem.ordem };
      else
        objecto = { modulo_id: modulosSubmodulo_id, submodulo_id: modulo, ordem: ordem.ordem };

      this.#ModuloSubModuloRepo.create(objecto);
    });
  }

  

}

module.exports = ModuloService;
