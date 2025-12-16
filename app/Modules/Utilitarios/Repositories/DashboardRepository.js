"use strict";
const FacturaRepository = use("App/Modules/Comercial/Facturacao/Repositories/FacturaRepository");
const ClienteRepository = use("App/Modules/CRM/Repositories/ClienteRepository");
const ProdutoRepository = use("App/Modules/Logistica/Repositories/ProdutoRepository");
const ReciboRepository = use("App/Modules/Comercial/Cobrancas/Repositories/ReciboRepository");
const SerieRepository = use("App/Modules/Utilitarios/Repositories/SerieRepository");

class DashboardRepository {
  constructor() {}

  async findDashboardInit() {

    return {
      facturas: await new FacturaRepository().findAll().whereIn("serie_id", new SerieRepository().findSeriesIdByDocumentos("FT")).where("status", 'N').getCount(),
      vendas: await new FacturaRepository().findAll().whereIn("serie_id", new SerieRepository().findSeriesIdByDocumentos("FR")).where("status",'N').getCount(),
      clientes: await new ClienteRepository().findAll().getCount(),
      produtos: await new ProdutoRepository().findAll().where("tipo", 'A').getCount(),
      servicos: await new ProdutoRepository().findAll().where("tipo", 'S').getCount(),
      recibos: await new ReciboRepository().findAll().where("status",'N').getCount()
    };
  }
}
module.exports = DashboardRepository;
