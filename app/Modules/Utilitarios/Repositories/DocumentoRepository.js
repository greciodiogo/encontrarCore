"use strict";
const BaseStorageRepository = use("App/Repositories/BaseStorageRepository");
const Database = use("Database");
class DocumentoRepository extends BaseStorageRepository {
  constructor() {
    super("Documento","App/Modules/Utilitarios/Models/");
  }


  findDocumentBySigla(docs) {
    docs.replace(/\s/g, '').split(',');
    return Database.select("sigla")
    .from("documentos")
    .whereIn('sigla',docs)

  }
}
module.exports = DocumentoRepository;
