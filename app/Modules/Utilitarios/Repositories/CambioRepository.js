"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
class CambioRepository extends BaseStorageRepository {
  constructor() {
    super("Cambio","App/Modules/Utilitarios/Models/");
  }
}
module.exports = CambioRepository;
