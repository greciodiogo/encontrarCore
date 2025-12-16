"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const FormRepository = use(
  "App/Modules/Utilitarios/Repositories/FormRepository"
);

class FormController {
  #formRepo;

  constructor() {
    this.#formRepo = new FormRepository();
  }



  async getProvinces({ response }) {
    const data = await this.#formRepo.getProvinces();
    return response.ok(data);
  }

  async getTarifarios({ response }) {
    const data = await this.#formRepo.getTarifarios();
    return response.ok(data);
  }

  async getTarifariosByCondicao({ request, response }) {
    const tecnologiaId = request.input("tecnologiaId");
    const tipoFacturacao = request.input("tipoFacturacao");
    const data = await this.#formRepo.getTarifariosByTecnologiaIdAndCondicao(tecnologiaId, tipoFacturacao);
    return response.ok(data);
  }

  async getTecnologias({ response }) {
    const data = await this.#formRepo.getTecnologias();
    return response.ok(data);
  }

  async getTecnologiasByType({ response, request }) {
    const tipoFacturacao = request.input("tipoFacturacao");
    const data = await this.#formRepo.getTecnologiasByType(tipoFacturacao);
    return response.ok(data);
  }

  async getFilials({ response }) {
    const data = await this.#formRepo.getFilials();
    return response.ok(data);
  }

  async getTarifarioById({ params, response }) {
    const { tarifario_id } = params;
    const data = await this.#formRepo.getTarifarioById(tarifario_id);
    return response.ok(data);
  }

  async getSearchClients({ request, response }) {
    const search = request.input("search");
    const status = request.input("status");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      typeClientId: request.input("typeClientId"),
      typeFilter: request.input("typeFilter"),
      searchBy: ["id", "nome", "email", "telefone"],
      //withRalationships: ["identidade", "genero", "tipoCliente","saldo"],
    };
    const data = await this.#formRepo.getSearchClients(search, options, status);
    return response.ok(data);
  }

  async getSearchProdutos({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
    };
    const data = await this.#formRepo.getSearchProdutos(search, options);
    return response.ok(data);
  }

  async getSearchProdutosOcasional({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
    };
    const data = await this.#formRepo.getSearchProdutosOcasional(
      search,
      options
    );
    return response.ok(data);
  }

  async getProdutosByGrupoSlug({ response }) {
    const data = await this.#formRepo.getProdutosByGrupoSlug();
    return response.ok(data);
  }

  async searchProdutoGrupos({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
    };
    const data = await this.#formRepo.searchProdutoGrupos(search, options);
    return response.ok(data);
  }
  async searchProdutoGruposVisivelPos({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
    };
    const data = await this.#formRepo.searchProdutoGruposVisivelPos(
      search,
      options
    );
    return response.ok(data);
  }

  async searchProdutosByProdutoGrupoId({ request, response }) {
    const search = request.input("search");
    const produtoGrupoId = request.input("grupoId");
    const bundleId = request.input("bundleId");
    const type = request.input("type");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 10,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "nome"],
      // withRalationships: ["categoria", "grupo"],
    };
    var data = await this.#formRepo.searchProdutosByProdutoGrupoId(
      search,
      produtoGrupoId,
      options,
      type,
      bundleId
    );
    return response.ok(data);
  }

  async searchClienteAdvanced({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      typeFilter: request.input("typeFilter"),
      searchBy: ["id", "nome", "email", "telefone"],
      withRalationships: ["identidade", "saldo"],
    };
    let data = await this.#formRepo
      .searchClienteAdvanced(search, options)
      .limit(5)
      .fetch();
    return response.ok(data);
  }

  async getSearchSimCards({ request, response }) {
    const search = request.input("search");
    const options = {
      page: request.input("page") || 1,
      perPage: request.input("perPage") || 5,
      orderBy: request.input("orderBy") || "id",
      typeOrderBy: request.input("typeOrderBy") || "DESC",
      searchBy: ["id", "iccid"],
    };
    const data = await this.#formRepo.getSearchSimCards(search, options);
    return response.ok(data);
  }

  async getSeries({ request, response }) {
    const typeDocs = request.input("typeDocs");
    const data = await this.#formRepo.getSeries(typeDocs);
    return response.ok(data);
  }

  async getSeriesByTipoFacturacao({ request, response }) {
    const typeDocs = request.input("typeDocs");
    const prefixo = request.input("prefixo");
    const data = await this.#formRepo.getSeriesByTipoFacturacao(typeDocs,prefixo);
    return response.ok(data);
  }

  async getFormaPagamentos({ response }) {
    const data = await this.#formRepo.getFormaPagamentos();
    return response.ok(data);
  }

  async getBancos({ response }) {
    const data = await this.#formRepo.getBancos();
    return response.ok(data);
  }
  async getContaBancariasByBancoId({ request, response }) {
    const bancoId = request.input("bancoId");
    const data = await this.#formRepo.getContaBancariasByBancoId(bancoId);
    return response.ok(data);
  }

  async getMoedas({ response }) {
    const data = await this.#formRepo.getMoedas();
    return response.ok(data);
  }

  async getImpostos({ response }) {
    const data = await this.#formRepo.getImpostos();
    return response.ok(data);
  }

  async getIsencoes({ response }) {
    const data = await this.#formRepo.getIsencoes();
    return response.ok(data);
  }

  async getOrganismos({ response }) {
    const data = await this.#formRepo.getOrganismos();
    return response.ok(data);
  }

  async getDocumentos({ response }) {
    const data = await this.#formRepo.getDocumentos();
    return response.ok(data);
  }

  async getRoles({ response }) {
    const data = await this.#formRepo.getRoles();
    return response.ok(data);
  }

  async getOwners({ response }) {
    const data = await this.#formRepo.getOwners();
    return response.ok(data);
  }

  async getArmazens({ response }) {
    const data = await this.#formRepo.getArmazens();
    return response.ok(data);
  }

  async getArmazensByTipo({ response, request }) {
    const tipo = request.input("tipo");
    const data = await this.#formRepo.getArmazensByTipo(tipo);
    return response.ok(data);
  }

  async getMotivosEntradaMercadoria({ response }) {
    const data = await this.#formRepo.getMotivosEntradaMercadoria();
    return response.ok(data);
  }

  async getMotivosDevolucao({ response }) {
    const data = await this.#formRepo.getMotivosDevolucao();
    return response.ok(data);
  }

  async getProdutos({ response }) {
    const data = await this.#formRepo.getProdutos();
    return response.ok(data);
  }

  async showTablesDatabase({ response }) {
    const data = await this.#formRepo.showTablesDatabase();
    return response.ok(data);
  }

  async getGeneros({ response }) {
    const data = await this.#formRepo.getGeneros();
    return response.ok(data);
  }
  async getEstadoCivils({ response }) {
    const data = await this.#formRepo.getEstadoCivils();
    return response.ok(data);
  }

  async getEstadoServico({ response }) {
    const data = await this.#formRepo.getEstadoServico();
    return response.ok(data);
  }

  async getComandoEstadoServicoCbs({ response }) {
    const data = await this.#formRepo.getComandoEstadoServicoCbs();
    return response.ok(data);
  }

  async getSeriesByDocuments({ params, response }) {
    const data = await this.#formRepo.getSeriesByDocuments(params.documento_id);
    return response.ok(data);
  }

  async getTypeAnexoByTypeClientId({ request, response }) {
    const typeClientId = request.input("TypeClientId");
    const data = await this.#formRepo.getTypeAnexoByTypeClientId(typeClientId);
    return response.ok(data);
  }


  async getAllContactsByAgentes({ request, response }) {
    const cliente_id = request.input("cliente_id");
    const data = await this.#formRepo.getAllContactsByAgentes(cliente_id);
    return response.ok(data);
  }

  async getTypeAnexoByTypeContaId({ request, response }) {
    const typeContaId = request.input("TypeContaId");
    const data = await this.#formRepo.getTypeAnexoByTypeContaId(typeContaId);
    return response.ok(data);
  }

  async getPaises({ response }) {
    const data = await this.#formRepo.getPaises();
    return response.ok(data);
  }
  async getProvincesByPais({ request, response }) {
    const paisId = request.input("paisId");
    const data = await this.#formRepo.getProvincesByPais(paisId);
    return response.ok(data);
  }

  async getMunicipiosByProvinciaId({ request, response }) {
    const provinciaId = request.input("provinciaId");
    const data = await this.#formRepo.getMunicipiosByProvinciaId(provinciaId);
    return response.ok(data);
  }
  async getDistritosByMunicipioId({ request, response }) {
    const municipioId = request.input("municipioId");
    const data = await this.#formRepo.getDistritosByMunicipioId(municipioId);
    return response.ok(data);
  }

  async getTypesAnexosNotInTypesClient({ request, response }) {
    const typeClientId = request.input("typeClientId");
    const data = await this.#formRepo.getTypesAnexosNotInTypesClient(
      typeClientId
    );
    return response.ok(data);
  }

  async getTypesAnexosNotInTypesConta({ request, response }) {
    const typeContaId = request.input("typeContaId");
    const data = await this.#formRepo.getTypesAnexosNotInTypesConta(
      typeContaId
    );
    return response.ok(data);
  }

  async getTypesAnexosByArea({ request, response }) {
    const Area = request.input("area");
    const data = await this.#formRepo.getTypesAnexosByArea(Area);
    return response.ok(data);
  }

  async getMotivoRejeicaoPedidoByArea({ request, response }) {
    const Area = request.input("area");
    const data = await this.#formRepo.getMotivoRejeicaoPedidoByArea(Area);
    return response.ok(data);
  }

  async getMotivoAnexoByArea({ request, response }) {
    const Area = request.input("area");
    const data = await this.#formRepo.getMotivoAnexoByArea(Area);
    return response.ok(data);
  }
  async getDebitoContaByClienteId({ request, response }) {
    const ClienteId = request.input("ClienteId");
    const data = await this.#formRepo.getDebitoContaByClienteId(ClienteId);
    return response.ok(data);
  }

  async getClienteGenerico({ response }) {
    const data = await this.#formRepo.getClienteGenerico();
    return response.ok(data);
  }

  async getUsers({ response }) {
    const data = await this.#formRepo.getUsers();
    return response.ok(data);
  }

  async getModulos({ response }) {
    const data = await this.#formRepo.getModulos();
    return response.ok(data);
  }

  async getModulosESubModulos({ response }) {
    const data = await this.#formRepo.getModulosESubModulos();
    return response.ok(data);
  }

  async getSubModulos({ response }) {
    const data = await this.#formRepo.getSubModulos();
    return response.ok(data);
  }

  ///////////// PONTO DE VENDAS
  
  async getUserPorLoja({ request, response }) {
    const lojaId = request.input("loja_id");
    const data = await this.#formRepo.getUserPorLoja(lojaId);
    return response.ok(data);
  }

}

module.exports = FormController;
