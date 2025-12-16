'use strict'
const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
class ContaBancariaRepository extends BaseStorageRepository {

  constructor() {
    super('ContaBancaria', "App/Modules/Utilitarios/Models/")
  }

  async findContaBancariasByBancoId(idBanco) {
    return  this.findAll().where("banco_id",idBanco).with('banco').with('moeda').fetch();
  }
}
module.exports = ContaBancariaRepository
