"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
class UserRepository extends BaseStorageRepository {
  constructor(connection = 'postgres') {
    super("User", "App/Modules/Security/Users/Models/", connection);
  }

  async findChefeLoja() {
    return this.findAll().where("is_actived", true)
      .whereHas('perfil',
        (builder) => {
          builder.where("slug",'chefe_loja')
        }).fetch();
  }
}
module.exports = UserRepository;
