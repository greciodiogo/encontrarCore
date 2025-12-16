"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
class RoleUserRepository extends BaseStorageRepository {
  constructor() {
    super("RoleUser", "App/Modules/Security/Acl/Models/");
  }
}
module.exports = RoleUserRepository;
