'use strict'
const IsentoRepository = use('App/Modules/Utilitarios/Repositories/IsentoRepository')


class ContaBancariaSevice {

  #IsentoRepo;

  constructor() {
    this.#IsentoRepo = new IsentoRepository()
  }

  async findAll(search, options) {
    let query = this.#IsentoRepo.findAll(search, options);
    return await (options.isPaginate ? query.paginate(options.page, (options.perPage || 10)) : query.fetch());
  }

  async create(createdPayload, auth_user_id) {
    return await this.#IsentoRepo.create({ ...createdPayload, user_id: auth_user_id });
  }

  async findById(isento_id) {
    return await this.#IsentoRepo.findById(isento_id).first();
  }

  async update(isento_id, updatedPayload) {
    return await this.#IsentoRepo.update(isento_id, updatedPayload);
  }

  async delete(isento_id) {
    return await this.#IsentoRepo.delete(isento_id);
  }
}
module.exports = ContaBancariaSevice;
