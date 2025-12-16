
const OrganismoRepository = use('App/Modules/Utilitarios/Repositories/OrganismoRepository')
const NotCreatedException = use("App/Exceptions/NotCreatedException");

class OrganismoServices {
    #organismoRepo;
    constructor() {
        this.#organismoRepo = new OrganismoRepository()
    }

    async show(search, options) {
        return await this.#organismoRepo
            .findAll(search, options)
            .paginate(options.page, options.perPage || 10)
    }
    async store({ fields, user_id }) {
        const organismoInfo = { ...fields, user_id };

        const verificarOrganismo = await this.#organismoRepo.findAll().where('nome',fields.nome).first();
        if (verificarOrganismo)
            throw new NotCreatedException("Caro Operador, Este Organismo Já se Encontra Cadastrado");

        return await this.#organismoRepo.create(organismoInfo);
    }
    async edit({ fields, organismo_id }) {
        return await this.#organismoRepo.update(organismo_id, fields)
    }

    async delete(organismo_id) {
        return await this.#organismoRepo.delete(organismo_id)
    }

    async showById(tecnolgias_id) {
        if (tecnolgias_id) return await this.#organismoRepo.findById(tecnolgias_id).first()
    }

    async showByNome(nome) {
        if (nome) return await this.#organismoRepo.findAll()
        .where('nome',nome).first()
    }
}
module.exports = OrganismoServices
