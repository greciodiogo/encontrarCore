module.exports = (ApiRoute, Route) =>
  // Protected routes
  ApiRoute(() => {
    Route.get("/getTypesClient", "FormController.getTypesClient");
    Route.get("/getTypesClientBySlug", "FormController.getTypesClientBySlug");

    Route.get("/getTypesIdentities", "FormController.getTypesIdentities");
    Route.get("/getTypesNacionalidade", "FormController.getTypesNacionalidade");

    Route.get("/getProvinces", "FormController.getProvinces");

    Route.get("/search-clients", "FormController.getSearchClients");
    Route.get("/getSearchProdutos", "FormController.getSearchProdutos");
    Route.get(
      "/getSearchProdutosOcasional",
      "FormController.getSearchProdutosOcasional"
    );
    Route.get(
      "/getProdutosByGrupoSlug",
      "FormController.getProdutosByGrupoSlug"
    );
    Route.get("/searchProdutoGrupos", "FormController.searchProdutoGrupos");
    Route.get(
      "/searchProdutoGruposVisivelPos",
      "FormController.searchProdutoGruposVisivelPos"
    );

    Route.get(
      "/searchProdutosByProdutoGrupoId",
      "FormController.searchProdutosByProdutoGrupoId"
    );

    Route.get("/searchClienteAdvanced", "FormController.searchClienteAdvanced");

    Route.get("/getSearchSimCards", "FormController.getSearchSimCards");

    Route.get("/getSeries", "FormController.getSeries");
    Route.get("/getSeriesByTipoFacturacao", "FormController.getSeriesByTipoFacturacao");
    Route.get("/getFormaPagamentos", "FormController.getFormaPagamentos");
    Route.get("/getBancos", "FormController.getBancos");
    Route.get("/getMoedas", "FormController.getMoedas");
    Route.get("/getImpostos", "FormController.getImpostos");
    Route.get("/getIsencoes", "FormController.getIsencoes");
    Route.get("/getCategoriaProduto", "FormController.getCategoriaProduto");
    Route.get("/getGruposProduto", "FormController.getGruposProduto");
    Route.get("/getDocumentos", "FormController.getDocumentos");
    Route.get("/getRoles", "FormController.getRoles");
    Route.get("/owners", "FormController.getOwners");
    Route.get("/armazens", "FormController.getArmazens");
    Route.get("/getArmazensByTipo", "FormController.getArmazensByTipo");
    Route.get(
      "/motivo-entrada-mercadorias",
      "FormController.getMotivosEntradaMercadoria"
    );
    Route.get("/motivo-devolucao", "FormController.getMotivosDevolucao");

    Route.get("/showTablesDatabase", "FormController.showTablesDatabase");

    Route.get("/getProdutos", "FormController.getProdutos");
    Route.get(
      "/getMunicipiosByProvinciaId",
      "FormController.getMunicipiosByProvinciaId"
    );
    Route.get(
      "/getDistritosByMunicipioId",
      "FormController.getDistritosByMunicipioId"
    );

    Route.get("/getGeneros", "FormController.getGeneros");

    Route.get(
      "/getSeriesByDocuments/:documento_id",
      "FormController.getSeriesByDocuments"
    );

    Route.get("/getEstadoCivils", "FormController.getEstadoCivils");
    Route.get("/getEstadoServico", "FormController.getEstadoServico");
    Route.get(
      "/getComandoEstadoServicoCbs",
      "FormController.getComandoEstadoServicoCbs"
    );

    Route.get(
      "/getTypeAnexoByTypeClientId",
      "FormController.getTypeAnexoByTypeClientId"
    );

    Route.get(
      "/getAllContactsByAgentes",
      "FormController.getAllContactsByAgentes"
    );

    Route.get(
      "/getTypeAnexoByTypeContaId",
      "FormController.getTypeAnexoByTypeContaId"
    );

    Route.get(
      "/getTypesAnexosNotInTypesClient",
      "FormController.getTypesAnexosNotInTypesClient"
    );
    Route.get(
      "/getTypesAnexosNotInTypesConta",
      "FormController.getTypesAnexosNotInTypesConta"
    );
    Route.get(
      "/getDebitoContaByClienteId",
      "FormController.getDebitoContaByClienteId"
    );

    Route.get("/getMotivoAnexoByArea", "FormController.getMotivoAnexoByArea");
    Route.get("/getTypesAnexosByArea", "FormController.getTypesAnexosByArea");

    Route.get(
      "/getMotivoRejeicaoPedidoByArea",
      "FormController.getMotivoRejeicaoPedidoByArea"
    );

    Route.get("/getUsers", "FormController.getUsers");

    Route.get(
      "/getTarifariosByTecnologiaId",
      "FormController.getTarifariosByTecnologiaId"
    );

    Route.get(
      "/getTarifariosByTecnologiaIdOS",
      "FormController.getTarifariosByTecnologiaIdOS"
    );

    Route.get(
      "/getTarifariosByCondicao",
      "FormController.getTarifariosByCondicao"
    );


    Route.get("/getTarifarios", "FormController.getTarifarios");
    Route.get("/getTecnologias", "FormController.getTecnologias");
    Route.get("/getTecnologiasByType", "FormController.getTecnologiasByType");
    Route.get("/getFilials", "FormController.getFilials");

    Route.get("/getPaises", "FormController.getPaises");
    Route.get("/getProvincesByPais", "FormController.getProvincesByPais");

    Route.get("/getModulos", "FormController.getModulos");
    Route.get("/getTodosModulos", "FormController.getTodosModulos");

    Route.get("/getModulosESubModulos", "FormController.getModulosESubModulos");
    Route.get("/getSubModulos", "FormController.getSubModulos");
    Route.get(
      "/getSubModulosByModulosId",
      "FormController.getSubModulosByModulosId"
    );
    Route.get(
      "/getSubModulosNaoAssociadAoModulo",
      "FormController.getSubModulosNaoAssociadAoModulo"
    );
    Route.get(
      "/getRangeSimCardReservadoBySerialNumber",
      "FormController.getRangeSimCardReservadoBySerialNumber"
    ).middleware(["auth"]);
    Route.get(
      "/getRangeSimCardBySerialNumber",
      "FormController.getRangeSimCardBySerialNumber"
    ).middleware(["auth"]);
    Route.get(
      "/getRangeRecargaFisicaBySerialNumber",
      "FormController.getRangeRecargaFisicaBySerialNumber"
    ).middleware(["auth"]);
    Route.get(
      "/getEquipamentoBySerialNumber",
      "FormController.getEquipamentoBySerialNumber"
    ).middleware(["auth"]);
    Route.get(
      "/getContaBancariasByBancoId",
      "FormController.getContaBancariasByBancoId"
    ).middleware(["auth"]);

    Route.get(
      "/getNumeracaoPorLoja",
      "FormController.getNumeracaoPorLoja"
    ).middleware(["auth"]);
    Route.get(
      "/getPermissoesPorModulo",
      "FormController.getPermissoesPorModulo"
    ).middleware(["auth"]);
    Route.get(
      "/getModulosPorPerfil",
      "FormController.getModulosPorPerfil"
    ).middleware(["auth"]);
    Route.get(
      "/getPermissoesPorPerfil",
      "FormController.getPermissoesPorPerfil"
    ).middleware(["auth"]);

    Route.get(
      "/getServiosClienteIdByContaId",
      "FormController.getServiosClienteIdByContaId"
    ).middleware(["auth"]);

    Route.get(
      "/getServicoByChaveServico",
      "FormController.getServicoByChaveServico"
    ).middleware(["auth"]);

    Route.get("/getLojas", "FormController.getLojas").middleware(["auth"]);

    Route.get("/getTPAsByLojaId", "FormController.getTPAsByLojaId").middleware([
      "auth",
    ]);

    Route.get(
      "/getTPAsByLojaIdUserLogado",
      "FormController.getTPAsByLojaIdUserLogado"
    ).middleware(["auth"]);

    Route.get(
      "/getClienteGenerico",
      "FormController.getClienteGenerico"
    ).middleware(["auth"]);

    Route.get("/getOrganismos", "FormController.getOrganismos").middleware([
      "auth",
    ]);

    Route.get("/getTipoConta", "FormController.getTipoConta").middleware([
      "auth",
    ]);

    Route.get("/getUserPorLoja", "FormController.getUserPorLoja").middleware([
      "auth",
    ]);

    Route.get(
      "/getPermissoesPorEntidadeRelacionada",
      "FormController.getPermissoesPorEntidadeRelacionada"
    ).middleware(["auth"]);
    Route.get(
      "/getPermissoesPorModuloSemEstarNoutro",
      "FormController.getPermissoesPorModuloSemEstarNoutro"
    ).middleware(["auth"]);

    Route.get("/getPermissoes", "FormController.getPermissoes").middleware([
      "auth",
    ]);

    Route.get(
      "/getGruposProdutosComProdutos",
      "FormController.getGruposProdutosComProdutos"
    ).middleware(["auth"]);

    Route.get(
      "/getSimCardPorLojaEstadoDif",
      "FormController.getSimCardPorLojaEstadoDif"
    ).middleware(["auth"]);

    Route.get(
      "/listarArmazens",
      "FormController.getArmazensPagination"
    ).middleware(["auth"]);

    Route.get(
      "/getRangeSimCardBySerialNumberTransferRange",
      "FormController.getRangeSimCardBySerialNumberTransferRange"
    ).middleware(["auth"]);

    Route.get(
      "/getRangeRecargaFisicaBySerialNumberTransferRange",
      "FormController.getRangeRecargaFisicaBySerialNumberTransferRange"
    ).middleware(["auth"]);

    Route.get(
      "/getEquipamentoBySerialNumberRange",
      "FormController.getEquipamentoBySerialNumberRange"
    ).middleware(["auth"]);

    Route.get("/getProdutosByGrupoId", "FormController.getProdutosByGrupoId");

    Route.get("/getRecargasFisicas", "FormController.getRecargasFisicas");

    Route.get("/getBundles", "FormController.getBundles"); //.middleware(["auth"]);

    Route.get(
      "/getRangeRecargaFisicaEditBySerialNumber",
      "FormController.getRangeRecargaFisicaEditBySerialNumber"
    ).middleware(["auth"]);

    Route.get("/getPlanos", "FormController.getPlanos").middleware(["auth"]);

    Route.get(
      "/getTarifariosPlanoFamilia",
      "FormController.getTarifariosPlanoFamilia"
    ).middleware(["auth"]);

    Route.get(
      "/getGruposProdutoPorIds",
      "FormController.getGruposProdutoPorIds"
    );

    Route.get(
      "/getCategoriasProdutoByCategoriaIds",
      "FormController.getCategoriasProdutoByCategoriaIds"
    );

    Route.get(
      "/getProdutosByCategoriaId",
      "FormController.getProdutosByCategoriaId"
    );

    Route.get(
      "/getProdutosByCategoriaSlug",
      "FormController.getProdutosByCategoriaSlug"
    );

    Route.get("/getFornecedores", "FormController.getFornecedores");

    Route.get(
      "/getProdutosByGrupoAndCategoriaId",
      "FormController.getProdutosByGrupoAndCategoriaId"
    );

    Route.get(
      "/getNumeracaoDisponivelPorLojaESemLoja",
      "FormController.getNumeracaoDisponivelPorLojaESemLoja"
    ).middleware(["auth"]);

    Route.get(
      "/getRangeSimCardBySerialNumberTransferRangeStock",
      "FormController.getRangeSimCardBySerialNumberTransferRangeStock"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosNumeros",
      "FormController.getEstadosNumeros"
    ).middleware(["auth"]);

    Route.get(
      "/getAllDataServicoByChaveServico",
      "FormController.getAllDataServicoByChaveServico"
    ).middleware(["auth"]);

    Route.get("/getSerieByNome/:nome", "FormController.getSerieByNome");

    Route.get(
      "/getPlanosByIdsTarifarios/:idsTarifarios",
      "FormController.getPlanosByIdsTarifarios"
    ).middleware(["auth"]);

    Route.get(
      "/getLoteProdutosByProduto",
      "FormController.getLoteProdutosByProduto"
    ).middleware(["auth"]);
    Route.get(
      "/getRangeRecargaFisicaBySerialNumberAndLoja",
      "FormController.getRangeRecargaFisicaBySerialNumberAndLoja"
    ).middleware(["auth"]);
    Route.get(
      "/getRangeSimCardBySerialNumberAndLoja",
      "FormController.getRangeSimCardBySerialNumberAndLoja"
    ).middleware(["auth"]);

    Route.get(
      "/getEquipamentoBySerialNumberRangeAndLoja",
      "FormController.getEquipamentoBySerialNumberRangeAndLoja"
    ).middleware(["auth"]);

    Route.get(
      "/getServiosClienteIdByContaIdChaveServicoExcel",
      "FormController.getServiosClienteIdByContaIdChaveServicoExcel"
    ).middleware(["auth"]);

    Route.get(
      "/getParametroGeralPorNome",
      "FormController.getParametroGeralPorNome"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosLoteProdutoPorArea",
      "FormController.getEstadosLoteProdutoPorArea"
    ).middleware(["auth"]);

    Route.get("/getGraficas", "FormController.getGraficas").middleware([
      "auth",
    ]);

    Route.get(
      "/getTipoReclamacoes",
      "FormController.getTipoReclamacoes"
    ).middleware(["auth"]);

    Route.get(
      "/getCausaPreDefinidaReclamacao",
      "FormController.getCausaPreDefinidaReclamacao"
    );

    Route.get(
      "/getCategoriaNaoProcedenciaReclamacao",
      "FormController.getCategoriaNaoProcedenciaReclamacao"
    );

    Route.get("/getDireccoes", "FormController.getDireccoes").middleware([
      "auth",
    ]);

    Route.get("/getPrioridades", "FormController.getPrioridades").middleware([
      "auth",
    ]);

    Route.get(
      "/getEstadosReclamacao",
      "FormController.getEstadosReclamacao"
    ).middleware(["auth"]);


    Route.get(
      "/getEstadosPedidoNumeroEspecial",
      "FormController.getEstadosPedidoNumeroEspecial"
    ).middleware(["auth"]);

    Route.get(
      "/getOperadoresNaReclamacao",
      "FormController.getOperadoresNaReclamacao"
    ).middleware(["auth"]);

    Route.get(
      "/getNumeracaoDisponivelPorNumero",
      "FormController.getNumeracaoDisponivelPorNumero"
    ).middleware(["auth"]);

    Route.get(
      "/getTipoAnexoByPedido",
      "FormController.getTipoAnexoByPedido"
    )

    Route.get(
      "/getTiposPedido",
      "FormController.getTiposPedido"
    )

    Route.get(
      "/getUsersByDireccao",
      "FormController.getUsersByDireccao"
    )
    Route.get(
      "/getUsers",
      "FormController.getUsers"
    )
    

    Route.get(
      "/getDireccaosByTecnologiaId",
      "FormController.getDireccaosByTecnologiaId"
    )

    

    Route.get("/getUsersByDireccao", "FormController.getUsersByDireccao").middleware(["auth"]);

    Route.get("/getSimCardByICCID", "FormController.getSimCardByICCID").middleware(["auth"]);

    Route.get("/getPedidoEstados", "FormController.getPedidoEstados").middleware(["auth"]);

    Route.get(
      "/getServicoByChaveServicoOnPedido",
      "FormController.getServicoByChaveServicoOnPedido"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosTransferenciaStock",
      "FormController.getEstadosTransferenciaStock"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosEquipamentos",
      "FormController.getEstadosEquipamentos"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosRecargasFisicas",
      "FormController.getEstadosRecargasFisicas"
    ).middleware(["auth"]);

    Route.get(
      "/getEstadosSIMCards",
      "FormController.getEstadosSIMCards"
    ).middleware(["auth"]);

    Route.get(
      "/getRangeSimCardBySeriesOnTransfer",
      "FormController.getRangeSimCardBySeriesOnTransfer"
    ).middleware(["auth"]);

    Route.get("/getTipoEstados",
      "FormController.getTipoEstados"
    ).middleware(["auth"]);

    Route.get("/getEstadosPedidoProduto",
      "FormController.getEstadosPedidoProduto"
    ).middleware(["auth"]);

    Route.get("/getUsersOnRejeicaoSolicitacao",
      "FormController.getUsersOnRejeicaoSolicitacao"
    ).middleware(["auth"]);

    Route.get("/getTiposMovimentoStock",
    "FormController.getTiposMovimentoStock"
  ).middleware(["auth"]);
  

  Route.get("/getGrupoFacturacao", "FormController.getGrupoFacturacao");
  Route.get("/getFormaPagamentosByLoja", "FormController.getFormaPagamentosByLoja").middleware(["auth"]);

  Route.get("/getEscalaoCategoria", "FormController.getEscalaoCategoria");


  Route.get("/getModemLteCpesDisponivel",
    "FormController.getModemLteCpesDisponivel"
  ).middleware(["auth"]);

  Route.get("/searchSimCardByIccid",
    "FormController.searchSimCardByIccid"
  ).middleware(["auth"]);

  Route.get("/getServicoCapacidades",
    "FormController.getServicoCapacidades"
  ).middleware(["auth"]);

  
  Route.get(
    "/getProdutosGrupoFlateRateByService",
    "FormController.getProdutosGrupoFlateRateByService"
  );
  
  Route.get("/getMotivosEstadosServico", "FormController.getMotivosEstadosServico");

  Route.get("/getIctGrupo", "FormController.getIctGrupo");

  Route.get("/getIctPaisByGrupo", "FormController.getIctPaisByGrupo");
  Route.get("/getIctDestinoByPais", "FormController.getIctDestinoByPais");

  Route.get(
    "/getContaBancarias",
    "FormController.getContaBancarias"
  ).middleware(["auth"]);
  Route.get("/getCountEstatuto", "FormController.getCountEstatuto");

  Route.get("/getRecursoRedeCentral", "FormController.getRecursoRedeCentralRepository");
  Route.get("/getRecursoRedeArmarios", "FormController.getRecursoRedeArmariosRepository");
  Route.get("/getRecursoRedeCabos", "FormController.getRecursoRedeCabosRepository");
  Route.get("/getRecursoRedeCaixa", "FormController.getRecursoRedeCaixaRepository");
  Route.get("/getRecursoRedeCaixaPare", "FormController.getRecursoRedeCaixaPareRepository");

  Route.get("/getProdutosByTarifarioId", "FormController.getProdutosByTarifarioId");
  Route.get("/getPlanosByProdutoId", "FormController.getPlanosByProdutoId");
 
}, "form").namespace("App/Modules/Utilitarios/Controllers");
