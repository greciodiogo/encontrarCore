"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const Database = use('Database')

class ModuloPermissaoRepository extends BaseStorageRepository {
  constructor() {
    super("ModuloPermissao", "App/Modules/Security/Acl/Models/");
  }

  async getModuloPermissaoByModulo(modulo_id,permissao_id) {

    return await Database.select(
      'mp.*',
      ).from('modulo_permissaos as mp')
      .innerJoin("permissions as p", "mp.permissao_id", "p.id")
      .where("modulo_id", modulo_id)
      .where("permissao_id", permissao_id)
      .where("p.is_deleted", 0)
      .where("mp.is_deleted", 0)
      .first();
      
  }

}
module.exports = ModuloPermissaoRepository;
