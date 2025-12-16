'use strict'
const TpaRepository = use('App/Modules/Utilitarios/Repositories/TpaRepository')
const LogTransferenciaTpaRepository = use('App/Modules/Logs/Repositories/LogTransferenciaTpaRepository')


class ContaBancariaSevice {

  #TpaRepo;
  #LogTransferenciaTpaRepo;

  constructor() {
    this.#TpaRepo = new TpaRepository();
    this.#LogTransferenciaTpaRepo = new LogTransferenciaTpaRepository()
  }

  async findAll(search, options) {
    let query = this.#TpaRepo.findAll(search, options).where((builder) => {
      if (options.lojaSeleccionada && options.lojaSeleccionada !='null') {
        builder.where("loja_id", options.lojaSeleccionada);
      }  
      if (options.bancoSeleccionado && options.bancoSeleccionado !='null') {
        builder.where("banco_id", options.bancoSeleccionado);
      }
     if (search) { 
     if (options.typeFilter == "numero") { 
          builder.where("numero", search);
        } 
        if (options.typeFilter == "descricao") {
          builder.where("descricao", search);
        }
      } 
    }).with("contaBancaria").with('banco').with('loja');
    return await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
  }

  async create(createdPayload, auth_user_id) {
    return await this.#TpaRepo.create({ ...createdPayload, user_id: auth_user_id });
  }

  async findById(idTpa) {
    return await this.#TpaRepo.findById(idTpa).first();
  }

  async findTpaByContaBancariaId(idContabancaria) {
    return await this.#TpaRepo.findTpaByContaBancariaId(idContabancaria);
  }

  async update(idTpa, updatedPayload) {
    return await this.#TpaRepo.update(idTpa, updatedPayload);
  }

  async transferirTpa(tpaId,updatedPayload,user_id) {
  const tpa = await this.findById(tpaId);
              await this.#LogTransferenciaTpaRepo.create({...updatedPayload, tpa_id: tpa.id, loja_origem_id:tpa.loja_id,user_id:user_id});
    return await this.#TpaRepo.update(tpaId, {loja_id:updatedPayload.loja_destino_id});
  }

  async delete(idTpa) {
    return await this.#TpaRepo.delete(idTpa);
  }
}
module.exports = ContaBancariaSevice;
