"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const Database = use('Database')

class ModuloRoleRepository extends BaseStorageRepository {
  constructor() {
    super("ModuloRole", "App/Modules/Security/Acl/Models/");
  }

  
}
module.exports = ModuloRoleRepository;
