'use strict'
const BancoRepository = use('App/Modules/Utilitarios/Repositories/BancoRepository')


class BancoSevice {

  #BancoRepo;

  constructor() {
    this.#BancoRepo = new BancoRepository()
  }

  async findAll(search, options) {
    let query = this.#BancoRepo.findAll(search, options).with('contas')
    return await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
  }

  async create(createdPayload, auth_user_id) {
    return await this.#BancoRepo.create({ ...createdPayload, user_id: auth_user_id });
  }

  async findById(banco_id) {
    return await this.#BancoRepo.findById(banco_id).first();
  }

  async update(banco_id, updatedPayload) {
    return await this.#BancoRepo.update(banco_id, updatedPayload);
  }

  async delete(banco_id) {
    return await this.#BancoRepo.delete(banco_id);
  }
}
module.exports = BancoSevice;
