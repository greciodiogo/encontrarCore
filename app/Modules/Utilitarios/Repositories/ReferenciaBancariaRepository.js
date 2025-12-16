
    'use strict'
    const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
    class ReferenciaBancariaRepository extends BaseStorageRepository{

    constructor() {
      super('ReferenciaBancaria',"App/Modules/Utilitarios/Models/")
    }

    validarReferenciaBancaria(referencia) {
      return this.findAll().where('referencia', referencia).where('estado', true).getCount();
    }

    }
    module.exports = ReferenciaBancariaRepository
