"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");

class ModuloRepository extends BaseStorageRepository {

  constructor() {
    super("Modulo", "App/Modules/Security/Acl/Models/");
   }

}
module.exports = ModuloRepository;
