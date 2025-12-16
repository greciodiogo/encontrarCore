'use strict'
const ContaBancariaRepository = use('App/Modules/Utilitarios/Repositories/ContaBancariaRepository')


class ContaBancariaSevice {

  #ContaBancRepo;

  constructor() {
    this.#ContaBancRepo = new ContaBancariaRepository()
  }

  async findAll(search, options) {
    let query = this.#ContaBancRepo.findAll(search, options).with("banco").with('moeda');
    return await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
  }

  async create(createdPayload, auth_user_id) {
    return await this.#ContaBancRepo.create({ ...createdPayload, user_id: auth_user_id });
  }

  async findById(contaBancaria_id) {
    return await this.#ContaBancRepo.findById(contaBancaria_id).first();
  }

  async findContaBancariasByBancoId(contaBancaria_id) {
    return await this.#ContaBancRepo.findContaBancariasByBancoId(contaBancaria_id);
  }

  async update(contaBancaria_id, updatedPayload) {
    return await this.#ContaBancRepo.update(contaBancaria_id, updatedPayload);
  }

  async delete(contaBancaria_id) {
    return await this.#ContaBancRepo.delete(contaBancaria_id);
  }
}
module.exports = ContaBancariaSevice;
