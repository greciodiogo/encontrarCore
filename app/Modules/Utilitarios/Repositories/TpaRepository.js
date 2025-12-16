'use strict'
const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
class ContaBancariaRepository extends BaseStorageRepository {

  constructor() {
    super('Tpa', "App/Modules/Utilitarios/Models/")
  }

  async findTpaByContaBancariaId(idContaBancaria) {
    return  this.findAll().where("contabancaria_id",idContaBancaria).with('contaBancaria').fetch();
  }
}
module.exports = ContaBancariaRepository
