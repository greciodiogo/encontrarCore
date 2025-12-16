"use strict";
const TipoIdentidadeRepository = use(
  "App/Modules/CRM/Repositories/TipoIdentidadeRepository"
);
const TipoNacionalidadeRepository = use(
  "App/Modules/CRM/Repositories/TipoNacionalidadeRepository"
);
const GeneroRepository = use("App/Modules/CRM/Repositories/GeneroRepository");
const TipoContaRepository = use(
  "App/Modules/CRM/Repositories/TipoContaRepository"
);

const EstadoCivilRepository = use(
  "App/Modules/CRM/Repositories/EstadoCivilRepository"
);
const ComandosEstadoServicoCbsRepository = use(
  "App/Modules/CRM/Repositories/ComandosEstadoServicoCbsRepository"
);
const ClienteDebitoContaRepository = use(
  "App/Modules/CRM/Repositories/ClienteDebitoContaRepository"
);
const MotivoRejeicaoPedidoRepository = use(
  "App/Modules/Logistica/Repositories/MotivoRejeicaoPedidoRepository"
);

const ProvinceRepository = use(
  "App/Modules/Geografia/Repositories/ProvinciaRepository"
);
const MunicipioRepository = use(
  "App/Modules/Geografia/Repositories/MunicipioRepository"
);
const DistritoRepository = use(
  "App/Modules/Geografia/Repositories/DistritoRepository"
);
const PaisRepository = use("App/Modules/Geografia/Repositories/PaisRepository");

const SerieRepository = use(
  "App/Modules/Utilitarios/Repositories/SerieRepository"
);
const TipoAnexoRepository = use(
  "App/Modules/GestaoDocumental/Repositories/TipoAnexoRepository"
);
const AnexoMotivoRepository = use(
  "App/Modules/GestaoDocumental/Repositories/AnexoMotivoRepository"
);

const FormaPagamentoRepository = use(
  "App/Modules/Comercial/Pagamentos/Repositories/FormaPagamentoRepository"
);
const BancoRepository = use(
  "App/Modules/Utilitarios/Repositories/BancoRepository"
);
const ContaBancariaRepository = use(
  "App/Modules/Utilitarios/Repositories/ContaBancariaRepository"
);
const MoedaRepository = use(
  "App/Modules/Utilitarios/Repositories/MoedaRepository"
);
const Database = use("Database");

const DocumentoRepository = use(
  "App/Modules/Utilitarios/Repositories/DocumentoRepository"
);
const ImpostoRepository = use(
  "App/Modules/Utilitarios/Repositories/ImpostoRepository"
);

const IsentoRepository = use(
  "App/Modules/Utilitarios/Repositories/IsentoRepository"
);

const FilialRepository = use(
  "App/Modules/Utilitarios/Repositories/FilialRepository"
);

const UserRepository = use(
  "App/Modules/Security/Users/Repositories/UserRepository"
);
const RoleRepository = use(
  "App/Modules/Security/Acl/Repositories/RoleRepository"
);

const ProdutoRepository = use(
  "App/Modules/Logistica/Repositories/ProdutoRepository"
);
const BundleRepository = use(
  "App/Modules/Logistica/Bundles/Repositories/BundleRepository"
);
const BundleLinhaRepository = use(
  "App/Modules/Logistica/Bundles/Repositories/BundleLinhaRepository"
);

const ProdutoGrupoRepository = use(
  "App/Modules/Logistica/Repositories/ProdutoGrupoRepository"
);
const CategoriaProdutoRepository = use(
  "App/Modules/Logistica/Repositories/CategoriaProdutoRepository"
);

const OwnerRepository = use(
  "App/Modules/Logistica/Repositories/OwnerRepository"
);
const ArmazenRepository = use(
  "App/Modules/Logistica/Repositories/ArmazenRepository"
);
const MotivoEntradaMercadoriaRepository = use(
  "App/Modules/Logistica/Repositories/MotivoEntradaMercadoriaRepository"
);
const MotivoDevolucaoRepository = use(
  "App/Modules/Logistica/Repositories/MotivoDevolucaoRepository"
);

const TarifarioRepository = use(
  "App/Modules/Operacoes/Ofertas/Repositories/TarifarioRepository"
);

const TecnologiaRepository = use(
  "App/Modules/Aprovisionamento/Repositories/TecnologiaRepository"
);
const TpaRepository = use("App/Modules/Utilitarios/Repositories/TpaRepository");

const SimCardRepository = use(
  "App/Modules/Aprovisionamento/Repositories/SimCardRepository"
);
const RecargaFisicaRepository = use(
  "App/Modules/Inventarios/Repositories/RecargaFisicaRepository"
);
const EquipamentoRepository = use(
  "App/Modules/Inventarios/Repositories/EquipamentoRepository"
);

const ModuloRepository = use(
  "App/Modules/Security/Acl/Repositories/ModuloRepository"
);

const NumeracoeRepository = use(
  "App/Modules/Aprovisionamento/Repositories/NumeracoeRepository"
);

const LojaRepository = use(
  "App/Modules/Operacoes/Lojas/Repositories/LojaRepository"
);

const OrganismoRepository = use(
  "App/Modules/Utilitarios/Repositories/OrganismoRepository"
);

const PermissionRepository = use(
  "App/Modules/Security/Acl/Repositories/PermissionRepository"
);

const ModuloSubModuloRepository = use(
  "App/Modules/Security/Acl/Repositories/ModuloSubModuloRepository"
);

const TarifarioPlanoRepository = use(
  "App/Modules/Operacoes/Ofertas/Repositories/TarifarioPlanoRepository"
);

const TarifarioPlanoFamiliaRepository = use(
  "App/Modules/Operacoes/Ofertas/Repositories/TarifarioPlanoFamiliaRepository"
);

const FornecedorRepository = use(
  "App/Modules/Logistica/Repositories/FornecedorRepository"
);

const EstadoNumeroRepository = use(
  "App/Modules/Aprovisionamento/Repositories/EstadoNumeroRepository"
);

const LoteProdutoRepository = use(
  "App/Modules/Logistica/Repositories/LoteProdutoRepository"
);

const ParametroGeralRepository = use(
  "App/Modules/Utilitarios/Repositories/ParametroGeralRepository"
);

const EstadoLoteProdutoRepository = use(
  "App/Modules/Logistica/Repositories/EstadoLoteProdutoRepository"
);

const GraficaRepository = use(
  "App/Modules/Aprovisionamento/Repositories/GraficaRepository"
);

const TipoReclamacaoRepository = use(
  "App/Modules/Reclamacoes/Repositories/TipoReclamacaoRepository"
);

const CausaPreDefinidaReclamacaoRepository = use(
  "App/Modules/Reclamacoes/Repositories/CausaPreDefinidaReclamacaoRepository"
);

const CategoriaNaoProcedenciaReclamacaoRepository = use(
  "App/Modules/Reclamacoes/Repositories/CategoriaNaoProcedenciaReclamacaoRepository"
);



const DireccaoRepository = use(
  "App/Modules/CRM/Repositories/DireccaoRepository"
);
const PrioridadeRepository = use(
  "App/Modules/Logistica/Repositories/PrioridadeRepository"
);
  

const EstadoReclamacaoRepository = use(
  "App/Modules/Reclamacoes/Repositories/EstadoReclamacaoRepository"
);

const EstadoPedidoNumeroEspecialRepository = use(
  "App/Modules/Aprovisionamento/Repositories/EstadoPedidoNumeroEspecialRepository"
);


const PedidoTipoRepository = use('App/Modules/Gestao-Pedidos/Repositories/PedidoTipoRepository');

const PedidoEstadoRepository = use('App/Modules/Gestao-Pedidos/Repositories/PedidoEstadoRepository');

const NotFoundException = use("App/Exceptions/NotFoundException");

const EstadoTransferenciaStockRepository = use(
  "App/Modules/Logistica/Repositories/EstadoTransferenciaStockRepository"
);

const EquipamentoEstadoRepository = use(
  "App/Modules/Inventarios/Repositories/EquipamentoEstadoRepository"
);

const TipoEstadoRepository = use(
  "App/Modules/Configs/Repositories/TipoEstadoRepository"
);

const TipoMovimentoStockRepository = use(
  "App/Modules/Logistica/Repositories/TipoMovimentoStockRepository"
);


const GrupoFacturacaoRepository = use("App/Modules/Comercial/Facturacao/Repositories/GrupoFacturacaoRepository");

const EscalaoEstatutoRepository = use("App/Modules/Configs/Repositories/EscalaoEstatutoRepository");

const ServicoCapacidadeRepository = use("App/Modules/CRM/Repositories/ServicoCapacidadeRepository");
const IctGrupoRepository = use("App/Modules/Interconexao/Repositories/IctGrupoRepository");
const IctPaisesRepository = use("App/Modules/Interconexao/Repositories/IctPaisesRepository");
const IctDestinoRepository = use("App/Modules/Interconexao/Repositories/IctDestinoRepository");
const RecursoRedeArmariosRepository = use("App/Modules/RecursoRedes/Repositories/RecursoRedeArmariosRepository");
const RecursoRedeCabosRepository = use("App/Modules/RecursoRedes/Repositories/RecursoRedeCabosRepository");
const RecursoRedeCaixaRepository = use("App/Modules/RecursoRedes/Repositories/RecursoRedeCaixaRepository");
const RecursoRedeCaixaPareRepository = use("App/Modules/RecursoRedes/Repositories/RecursoRedeCaixaPareRepository");
const RecursoRedeCentralRepository = use("App/Modules/RecursoRedes/Repositories/RecursoRedeCentralRepository");


class FormRepository {
  constructor() { }
  modulosNovo = [];
  cadaModulo = {};
  totalModuloSubmodulo;
  moduloSubModulos;
  /**
   * @returns {Object}
   */

  /**
   * @returns {Object}
   */
  async getTypesIdentities() {
    return new TipoIdentidadeRepository().findAll().where('estado', true).fetch();
  }

  async getTypesNacionalidade() {
    return new TipoNacionalidadeRepository().findAll().fetch();
  }

  /**
   * @returns {Object}
   */
  async getProvinces() {
    return new ProvinceRepository().findAll(null, {orderBy: "nome", typeOrderBy: "ASC"}).fetch();
  }

  async getProvincesByPais(idPais) {
    return new ProvinceRepository().findAll(null, {orderBy: "nome", typeOrderBy: "ASC"}).where("pais_id", idPais).fetch();
  }

  async getPaises() {
    return new PaisRepository().findAll().fetch();
  }

  async getMunicipiosByProvinciaId(idProvincia) {
    return new MunicipioRepository()
      .findAll()
      .where("provincia_id", idProvincia)
      .fetch();
  }

  async getDistritosByMunicipioId(idMunicipio) {
    return new DistritoRepository()
      .findAll()
      .where("municipio_id", idMunicipio)
      .fetch();
  }

  /**
   * @returns {Object}
   */
  async getTarifarios() {
    return new TarifarioRepository().findAll().where("is_actived", 1).fetch();
  }

  async getTarifariosByTecnologiaId(idTecnologia) {
    return new TarifarioRepository()
      .findAll()
      .where("tecnologia_id", idTecnologia)
      .where("is_actived", true)
      .fetch();
  }


  async getTarifariosByTecnologiaIdOS(idTecnologia, tipoFacturacao) {
    return new TarifarioRepository()
      .findAll()
      .where("tecnologia_id", idTecnologia)
      .where("is_actived", true)
      .where("condicoes", "like", `%${tipoFacturacao}%`)
      .fetch();
  }

  async getTarifariosByTecnologiaIdAndCondicao(idTecnologia, tipoFacturacao) {
    return new TarifarioRepository()
      .findAll()
      .where("is_actived", true)
      .where("tecnologia_id", idTecnologia)
      .where("tipoFacturacao",  tipoFacturacao)
      .fetch();
  }



  async getTarifarioById(tarifario_id) {
    return new TarifarioRepository()
      .findAll()
      .where("id", tarifario_id)
      .fetch();
  }

  async getTecnologias() {
    return new TecnologiaRepository().findAll().with("tipoOsInfo").where("status", true).fetch();
  }

  async getTecnologiasByType(tipoFacturacao) {
    return new TecnologiaRepository()
      .findAll()
      .where(function () {
        if (tipoFacturacao) {
          this.where("tipoFacturacao", tipoFacturacao);
        }
      })
      .fetch();
  }

  async getFilials() {
    return new FilialRepository().findAll(null, {orderBy: "nome", typeOrderBy: "ASC"}).fetch();
    
  }

  /**
   * @returns {Object}
   */

  /**

  /**
   * @returns {Object}
   */
  async getSearchProdutos(search, options) {
    return new ProdutoRepository()
      .findAll(search, options)
      .with("imposto")
      .with("moeda")
      .paginate(options.page, options.perPage || 10);
  }

  async getSearchProdutosOcasional(search, options) {
    return new ProdutoRepository()
      .findAll(search, options)
      .where("is_ocasional", true)
      .with("imposto")
      .with("moeda")
      .fetch();
  }

  async getProdutosByGrupoSlug() {
    return new ProdutoRepository()
      .findAll()
      .whereHas("grupo", (builder) => {
        builder.where("is_flate", true);
      })
      .fetch();
  }

  async getProdutosGrupoFlateRateByService(tarifario_id) {
    return new ProdutoRepository()
      .findAll()
      .whereHas("grupo", (builder) => {
        builder.where("is_flate", true);
      })
      .whereHas("produtoTarifario", (builder) => {
        builder.where("tarifario_id", tarifario_id);
      })
     .fetch();
  }


  async searchProdutoGrupos(search, options) {
    return new ProdutoGrupoRepository()
      .findAll(search, options)
      .withCount("produtos")
      .paginate(options.page, 1000);
  }
  async searchProdutoGruposVisivelPos(search, options) {
    return new ProdutoGrupoRepository()
      .findAll(search, options)
      .where("visivel_pos", true)
      .withCount("produtos")
      .paginate(options.page, 1000);
  }

  async searchProdutosByProdutoGrupoId(
    search,
    grupoId,
    options,
    type = "NORMAL",
    bundleId = null
  ) {
    if (type == "BUNDLE") {
      var produtos = (
        await new BundleLinhaRepository()
          .findAll(search, options)
          .with("produto")
          .where("is_deleted", false)
          .where("estado", true)
          .where("bundle_id", bundleId)
          .paginate(options.page, options.perPage || 10)
      ).toJSON();
      for (let i = 0; i < produtos.data.length; i++) {
        const element = produtos.data[i];
        produtos.data[i] = {
          ...element.produto,
          quantidade: element.quantidade,
          valor: element.valor,
          custo_unitario: element.custo_unitario,
        };
      }
      return produtos;
    }
    return new ProdutoRepository()
      .findAll(search, options)
      .with("categoria")
      .with("grupo")
      .with("imposto")
      .with("produtoTarifario")
      .where("is_deleted", false)
      .where("produto_grupo_id", grupoId)
      .paginate(options.page, options.perPage || 10);
  }

  /**
   * @returns {Object}
   */
  async getSearchSimCards(search, options) {
    return await new SimCardRepository()
      .findAll(search, options)
      .limit(8)
      .fetch();
  }

  /**
   * @returns {Object}
   */
  async getSeries(docs) {
    return new SerieRepository().findSeriesIdBySiglaDocumentos(docs, [1]);
  }


  async getSeriesByTipoFacturacao(docs, prefixo) {
    return new SerieRepository().findSeriesByTipoFacturaca(docs, prefixo, [1]);
  }

  async getFormaPagamentos() {
    return new FormaPagamentoRepository().findAll().fetch();
  }


  async getBancos() {
    return new BancoRepository().findAll().fetch();
  }

  async getContaBancariasByBancoId(bancoId) {
    return new ContaBancariaRepository()
      .findAll()
      .where("banco_id", bancoId)
      .fetch();
  }

  async getMoedas() {
    return new MoedaRepository().findAll().with("cambio").fetch();
  }
  async getImpostos() {
    return new ImpostoRepository().findAll().fetch();
  }

  async getIsencoes() {
    return new IsentoRepository().findAll().fetch();
  }

  async getOrganismos() {
    return new OrganismoRepository().findAll().fetch();
  }

  async getDocumentos() {
    return new DocumentoRepository().findAll().fetch();
  }

  async getRoles() {
    return new RoleRepository().findAll().fetch();
  }

  async getUsers() {
    return new UserRepository().findAll().fetch();
  }

  async getOwners() {
    return new OwnerRepository().findAll().fetch();
  }

  async getArmazens() {
    return new ArmazenRepository().findAll().fetch();
  }

  async getArmazensByTipo(tipo) {
    return new ArmazenRepository().findAll().where("tipo", tipo).fetch();
  }

  async getMotivosEntradaMercadoria() {
    return new MotivoEntradaMercadoriaRepository().findAll().fetch();
  }

  async getMotivosDevolucao() {
    return new MotivoDevolucaoRepository().findAll().fetch();
  }

  async getProdutos() {
    return new ProdutoRepository()
      .findAll(null, {orderBy: "nome", typeOrderBy: "ASC"})
      .with("imposto")
      .with("moeda")
      .with("categoria")
      .fetch();
  }

  /**
   * @returns {Object}
   */
  async showTablesDatabase() {
    const tables = await Database.raw("SHOW TABLES");
    return tables[0];
  }

  /**
   * @returns {Object}
   */
  async getGeneros() {
    return new GeneroRepository().findAll().where('is_actived', true).fetch();
  }

  /**
   * @returns {Object}
   */
  async getEstadoCivils() {
    return new EstadoCivilRepository().findAll().where('is_actived', true).fetch();
  }


  async getComandoEstadoServicoCbs() {
    return new ComandosEstadoServicoCbsRepository().findAll(null,{ orderBy: "id", typeOrderBy: "ASC" }, "id, comando_bloqueio as nome, comando_desbloqueio").fetch();
  }

  /**
   * @returns {Object}
   */
  async getTypeAnexoByTypeClientId(typeClientId) {
    return Database.select("tipo_anexos.nome", "tipo_anexos.id")
      .from("tipo_anexo_clientes")
      .leftJoin(
        "tipo_clientes",
        "tipo_clientes.id",
        "tipo_anexo_clientes.tipo_cliente_id"
      )
      .leftJoin(
        "tipo_anexos",
        "tipo_anexos.id",
        "tipo_anexo_clientes.tipo_anexo_id"
      )
      .where("tipo_anexo_clientes.tipo_cliente_id", typeClientId);
  }

  async getAllContactsByAgentes(cliente_id) {
    return Database.select("clientes.nome as cliente", "servicos.chaveServico", "servicos.id as servico_id", "contas.id as conta_id")
      .from("servicos")
      .innerJoin(
        "contas",
        "contas.id",
        "servicos.conta_id"
      )
      .innerJoin(
        "clientes",
        "clientes.id",
        "contas.cliente_id"
      )
      .innerJoin(
        "tipo_contas",
        "tipo_contas.id",
        "contas.tipo_conta_id"
      )
      .where("tipo_contas.slug", "AGENTE")
      .where("clientes.id", cliente_id);
  }

  async getTypeAnexoByTypeContaId(typeContaId) {
    return Database.select("tipo_anexos.nome", "tipo_anexos.id")
      .from("tipo_anexo_contas")
      .leftJoin(
        "tipo_contas",
        "tipo_contas.id",
        "tipo_anexo_contas.tipo_conta_id"
      )
      .leftJoin(
        "tipo_anexos",
        "tipo_anexos.id",
        "tipo_anexo_contas.tipo_anexo_id"
      )
      .where("tipo_anexo_contas.tipo_conta_id", typeContaId)
      .where("tipo_anexo_contas.is_deleted", false);
  }

  /**
   * @returns {Object}
   */
  async getSeriesByDocuments(documento_id) {
    return new SerieRepository()
      .findAll()
      .where("documento_id", documento_id)
      .with("documento")
      .fetch();
  }

  async getTypesAnexosNotInTypesClient(typeClientId) {
    return new TipoAnexoRepository()
      .findAll()
      .whereNotIn(
        "id",
        Database.select("tipo_anexo_id")
          .from("tipo_anexo_clientes")
          .where("tipo_cliente_id", typeClientId)
      )
      .fetch();
  }

  async getTypesAnexosNotInTypesConta(typeContaId) {
    return new TipoAnexoRepository()
      .findAll()
      .whereNotIn(
        "id",
        Database.select("tipo_anexo_id")
          .from("tipo_anexo_contas")
          .where("tipo_conta_id", typeContaId)
          .where("is_deleted", false)
      )
      .fetch();
  }

  async getTypesAnexosByArea(Area) {
    return new TipoAnexoRepository().findAll().where("area", Area).fetch();
  }

  async getMotivoRejeicaoPedidoByArea(Area) {
    return new MotivoRejeicaoPedidoRepository()
      .findAll()
      .where("area", Area)
      .fetch();
  }

  async getMotivoAnexoByArea(Area) {
    return new AnexoMotivoRepository().findAll().where("area", Area).fetch();
  }
  async getDebitoContaByClienteId(ClienteId) {
    return new ClienteDebitoContaRepository()
      .findAll()
      .where("cliente_id", ClienteId)
      .fetch();
  }

  /**
   * @returns {Object}
   */
  async getModulosESubModulos() {
    let modulos = await new ModuloRepository()
      .findAll()
      .where("is_deleted", false)
      .where("is_principal", true)
      .fetch();
    this.modulosNovo = [];
    this.cadaModulo = {};
    this.totalModuloSubmodulo = await new ModuloSubModuloRepository().maxId();
    this.totalModuloSubmodulo = this.totalModuloSubmodulo
      ? this.totalModuloSubmodulo.id
      : 1;
    this.totalModuloSubmodulo = this.totalModuloSubmodulo * -1;
    modulos = modulos.toJSON();
    await this.organizarModuloSubModulo(modulos);
    this.modulosNovo = this.modulosNovo.filter((cada) => cada.is_principal);
    return this.modulosNovo;
  }

  async organizarModuloSubModulo(modulos) {
    try {
      for (let modulo of modulos) {
        this.cadaModulo = modulo;
        this.moduloSubModulos = await this.getModuloSubModulosByModulo(
          modulo.id
        );
        this.cadaModulo["subModulos"] = this.moduloSubModulos;
        this.cadaModulo["operacoes"] =
          await this.getPermissoesPorModuloSemEstarNoutro(modulo.id);

        if (modulo.is_principal) {
          this.totalModuloSubmodulo--;
          this.cadaModulo["modulo_submodulo_id"] = this.totalModuloSubmodulo;
          this.cadaModulo["is_deleted_modulo_submodulo"] = 0;
        }

        this.modulosNovo.push(this.cadaModulo);

        this.moduloSubModulos = Array.isArray(this.moduloSubModulos)
          ? this.moduloSubModulos
          : [];

        if (this.moduloSubModulos.length > 0) {
          await this.organizarModuloSubModulo(this.moduloSubModulos); //Chama recursivamente a mesma funcao
        }
      }
    } catch (error) {
      console.log("error:" + error);
    }
  }

  /**
   * @returns {Object}
   */
  async getModulosESubModulosPorModulo(moduloId) {
    return await new ModuloRepository()
      .findAll()
      .with("moduloSubModulos", (builder) => {
        builder.where("is_deleted", false).where("modulo_id", moduloId);
      })
      .where("is_deleted", false)
      .fetch();
  }

  /**
   * @returns {Object}
   */
  async getModulos() {
    return new ModuloRepository()
      .findAll()
      .where("is_deleted", false)
      .where("is_principal", true)
      .fetch();
  }

  async getSubModulosByModulos(idModulo) {
    return new ModuloRepository()
      .findAll()
      .where("is_deleted", false)
      .with("subModulos")
      .where("is_principal", false)
      .where("id", idModulo)
      .fetch();
  }

  async getSubModulos(idModulo) {
    return new ModuloRepository()
      .findAll()
      .where("is_deleted", false)
      .where("is_principal", false)
      .fetch();
  }

  async getModuloSubModulosByModulo(modulo_id) {
    return await Database.select(
      "submodulos.*",
      "ms.id as modulo_submodulo_id",
      "ms.is_deleted as is_deleted_modulo_submodulo"
    )
      .from("modulos as submodulos")
      .innerJoin("modulo_submodulos as ms", "ms.submodulo_id", "submodulos.id")
      .where("ms.modulo_id", modulo_id)
      .where("submodulos.is_deleted", 0)
      .where("ms.is_deleted", 0)
      .orderBy("ms.ordem", "asc");
  }

  async getSubModulosNaoAssociadAoModulo(modulo_id) {
    const subModulosDoModulo = Database.select("submodulos.id")
      .from("modulos as submodulos")
      .innerJoin("modulo_submodulos as ms", "ms.submodulo_id", "submodulos.id")
      .where("ms.modulo_id", modulo_id)
      .where("submodulos.is_deleted", 0)
      .where("ms.is_deleted", 0);

    return await Database.select("submodulos.*")
      .from("modulos as submodulos")
      .where("submodulos.is_deleted", 0)
      .where("submodulos.is_principal", 0)
      .whereNotIn("submodulos.id", subModulosDoModulo);
  }

  async getGruposProduto() {
    return await Database.select("*")
      .from("produto_grupos")
      .where("is_deleted", false); //new ProdutoGrupoRepository().findAll().fetch();
  }

  async getCategoriaProduto() {
    return new CategoriaProdutoRepository().findAll().fetch();
  }

  async getNumeracaoPorLoja(loja_id) {
    return new NumeracoeRepository()
      .findAll()
      .where("loja_id", loja_id)
      .where("is_deleted", 0)
      .where("status", 0)
      .fetch();
  }

  async getRangeSimCardBySerialNumber(
    startNumber,
    endNumber = null,
    requerNumero = null,
    typeAccount = null,
    typeFilter = null,
    lojaId = null,
    quant = 1,
    regra = "8924404"
  ) {
    const simCardRepo = new SimCardRepository();
    if (typeFilter != "MSISDN") {
      startNumber =
        startNumber.toString().length >= 19
          ? startNumber
          : `${regra}${startNumber}`;
      endNumber =
        endNumber.length >= 19
          ? endNumber
          : endNumber.length == 0
            ? null
            : `${regra}${endNumber}`;
    }

    /* if (typeFilter == 'ICCID') {
       if (startNumber && endNumber) {

         if (!(await simCardRepo.findAll().where("iccid", endNumber).first())) {
           return [];
         }
         if (!(await simCardRepo.findAll().where("iccid", startNumber).first())) {
           return [];
         }
       }
     }*/

    return simCardRepo
      .findAll(
        null,
        { orderBy: "iccid", typeOrderBy: "ASC" },
        "*, estadoInventario as estado"
      )
      .where("estadoInventario", "LIVRE")
      .where(function () {
        if (lojaId) {
          this.where("loja_id", lojaId);
        }
        if (typeFilter == "MSISDN") {
          this.whereIn(
            "numeracao_id",
            Database.select("id")
              .from("numeracoes")
              .where("numero", startNumber)
          );
        }
        if (Number(requerNumero)) {
          this.whereNotNull("numeracao_id");
        }

        if (!Number(requerNumero)) {
          this.whereNull("numeracao_id");
        }

        if (typeFilter == "ICCID") {
          if (startNumber && endNumber) {
            // this.whereBetween("iccid", [startNumber, endNumber]);
            this.whereRaw(
              `cast(iccid as UNSIGNED) between ${startNumber} AND ${endNumber}`
            );
          } else {
            this.where("iccid", startNumber);
          }
        }

        if (typeAccount) {
          // this.where("tipo_conta_id", typeAccount);
        }
      })
      .limit(quant || 1)
      .with("numero")
      .fetch();
  }

  async getRangeSimCardReservadoBySerialNumber(
    startNumber,
    endNumber = null,
    requerNumero = null,
    typeAccount = null,
    typeFilter = null,
    lojaId = null,
    quant = 1,
    regra = "8924404"
  ) {
    const simCardRepo = new SimCardRepository();
    if (typeFilter != "MSISDN") {
      startNumber =
        startNumber.toString().length >= 19
          ? startNumber
          : `${regra}${startNumber}`;
      endNumber =
        endNumber.length >= 19
          ? endNumber
          : endNumber.length == 0
            ? null
            : `${regra}${endNumber}`;
    }

    /* if (typeFilter == 'ICCID') {
       if (startNumber && endNumber) {

         if (!(await simCardRepo.findAll().where("iccid", endNumber).first())) {
           return [];
         }
         if (!(await simCardRepo.findAll().where("iccid", startNumber).first())) {
           return [];
         }
       }
     }*/

    return simCardRepo
      .findAll(
        null,
        { orderBy: "iccid", typeOrderBy: "ASC" },
        "*, estadoInventario as estado"
      )
      .where("estadoInventario", "RESERVDO_BACKOFFICE")
      .where(function () {
        if (lojaId) {
          this.where("loja_id", lojaId);
        }
        if (typeFilter == "MSISDN") {
          this.whereIn(
            "numeracao_id",
            Database.select("id")
              .from("numeracoes")
              .where("numero", startNumber)
          );
        }
        if (Number(requerNumero)) {
          this.whereNotNull("numeracao_id");
        }

        if (!Number(requerNumero)) {
          this.whereNull("numeracao_id");
        }

        if (typeFilter == "ICCID") {
          if (startNumber && endNumber) {
            // this.whereBetween("iccid", [startNumber, endNumber]);
            this.whereRaw(
              `cast(iccid as UNSIGNED) between ${startNumber} AND ${endNumber}`
            );
          } else {
            this.where("iccid", startNumber);
          }
        }

        if (typeAccount) {
          // this.where("tipo_conta_id", typeAccount);
        }
      })
      .limit(quant || 1)
      .with("numero")
      .fetch();
  }

  async getRangeRecargaFisicaBySerialNumber(
    startNumber,
    endNumber = null,
    produtoId = null,
    quant = 1,
    lojaId = null
  ) {
    const recargaFisicaRepo = new RecargaFisicaRepository();
    if (startNumber && endNumber) {
      if (
        !(await recargaFisicaRepo.findAll().where("serie", endNumber).first())
      ) {
        return [];
      }
      if (
        !(await recargaFisicaRepo.findAll().where("serie", startNumber).first())
      ) {
        return [];
      }
    }

    return recargaFisicaRepo
      .findAll(null, { orderBy: 'serie' })
      .where("estado", "DISPONIVEL")
      .where(function () {
        if (startNumber && endNumber) {
          this.whereBetween("serie", [startNumber, endNumber]);
        } else {
          this.where("serie", startNumber);
        }
        if (produtoId) {
          this.where("produto_id", produtoId);
        }
        if (lojaId) {
          this.where("loja_id", lojaId);
        }
      })
      .limit(quant || 1)
      .fetch();
  }

  async getEquipamentoBySerialNumber(
    serieNumber,
    produtoId = null,
    lojaId = null
  ) {
    serieNumber = serieNumber.toString().replace(/\s/g, "").split(";");
    return new EquipamentoRepository()
      .findAll(null, {
        withRalationships: [
          "equipamentoFabricante",
          "equipamentoTipo",
          "equipamentoEstado",
          "equipamentoModelo",
          "produto",
          "tecnologia",
          "loja",
        ],
      })
      .whereHas("equipamentoEstado", (builder) => {
        builder.where("sigla", "DISPONIVEL");
      })
      .whereIn("numero_serie", serieNumber)
      .where(function () {
        if (produtoId) {
          this.where("produto_id", produtoId);
        }
        if (lojaId) {
          this.where("loja_id", lojaId);
        }
      })
      .fetch();
  }

  async getPermissoesPorModulo(modulo_id) {
    return await Database.select("p.*")
      .from("modulo_permissaos as mp")
      .innerJoin("permissions as p", "mp.permissao_id", "p.id")
      .where("mp.modulo_id", modulo_id)
      .where("mp.is_deleted", 0)
      .where("p.is_deleted", 0);
  }

  /**
   * @author "caniggia.moreira@ideiasdinamicas.com"
   * @deprecated "getAssistentesByLojaId"
   * @returns {Object}
   */
  async getAssistentesByLojaId(LojaId) {
    return await Database.select("id", "name")
      .from("users")
      .where("loja_id", LojaId);
  }

  async getLojas() {
    return new LojaRepository().findAll().where("is_deleted", false).fetch();
  }

  async getTPAsByLojaId(lojaId, estado = false) {
    return new TpaRepository()
      .findAll()
      .with("banco")
      .with("contaBancaria")
      .where("loja_id", lojaId)
      .where(function () {
        if (estado) {
          this.where('is_actived', true);
        }
      })
      .fetch();
  }

  async getTipoConta() {
    return new TipoContaRepository().findAll().where('is_actived', true).fetch();
  }

  async getUserPorLoja(lojaId) {
    return new UserRepository().findAll().where("loja_id", lojaId).fetch();
  }

  async getPermissoesPorEntidadeRelacionada(entidade_relacionada) {
    return new PermissionRepository()
      .findAll()
      .whereNull("permission_id")
      .where("name", "like", `%${entidade_relacionada}%`)
      .fetch();
  }

  async getPermissoesPorModuloSemEstarNoutro(modulo_id) {
    const submodulos = Database.select("mp.permissao_id")
      .from("modulo_submodulos as ms")
      .innerJoin("modulo_permissaos as mp", "mp.modulo_id", "ms.submodulo_id")
      .where("ms.modulo_id", modulo_id);

    return await Database.select("p.*", "mp.id as modulo_permissao_id")
      .from("modulo_permissaos as mp")
      .innerJoin("permissions as p", "mp.permissao_id", "p.id")
      .where("modulo_id", modulo_id)
      .where("p.is_deleted", 0)
      .where("p.type_permission", "A")
      .where("mp.is_deleted", 0)
      .whereNotIn("mp.permissao_id", submodulos);
  }

  async getPermissoesPorPerfil(role_id) {
    return await Database.select("permission_id", "modulo_permissao_id")
      .from("permission_role")
      .where("role_id", role_id)
      .where("is_deleted", 0);
  }

  async getModulosPorPerfil(role_id) {
    return await Database.select("modulo_id", "modulo_submodulo_id")
      .from("modulo_roles")
      .where("role_id", role_id)
      .where("is_deleted", 0);
  }

  async getTodosModulos(filtro = undefined) {
    return new ModuloRepository()
      .findAll()
      .where("is_deleted", false)
      .where(function () {
        if (filtro != undefined && filtro != null) {
          this.where("nome", "like", `%${filtro}%`);
        }
      })
      .fetch();
  }

  async getModuloSubModuloByModulo(modulo_id) {
    return await Database.select("id")
      .from("modulo_submodulos")
      .where("modulo_id", modulo_id)
      .where("submodulo_id", modulo_id)
      .where("is_deleted", 0)
      .first();
  }

  async getPermissoes() {
    return new PermissionRepository().findAll().where("is_deleted", 0).fetch();
  }

  /**
   * @returns {Object}
   */
  async getGruposProdutosComProdutos() {
    return new ProdutoGrupoRepository().findAll().with("produtos").fetch();
  }

  /**
   * @returns {Object}
   */
  async getSimCardPorLojaEstadoDif(loja_id = undefined, estado) {
    return new SimCardRepository()
      .findAll()
      .where(function () {
        if (loja_id != undefined) {
          this.where("loja_id", loja_id);
        }
      })
      .where("estadoInventario", estado)
      .fetch();
  }

  async getArmazensPagination(search, options) {
    let query = new ArmazenRepository().findAll(search, options);
    return options.isPaginate
      ? query.paginate(options.page, options.perPage || 10)
      : query.fetch();
  }

}
module.exports = FormRepository;
