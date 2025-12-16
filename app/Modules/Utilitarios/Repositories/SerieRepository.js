
'use strict'
const BaseStorageRepository = use('App/Repositories/BaseStorageRepository');
const Database = use('Database');
class SerieRepository extends BaseStorageRepository{

    constructor() {
         super('Serie',"App/Modules/Utilitarios/Models/")
    }

  findSeriesIdByDocumentos(docs){
      docs = docs.replace(/\s/g, '').split(',');
      return  Database.select('id').from(`${this.model.table}`)
     .whereIn('documento_id', Database.select('id').from('documentos').whereIn('sigla', (docs instanceof Array? docs: [docs])))
  }

   findSeriesIdByDocumentoId(docsId){
    return  Database.select('id').from(`${this.model.table}`)
   .whereIn('documento_id', Database.select('id').from('documentos').whereIn('id', (docsId instanceof Array? docsId: [docsId])))
  }

  findSeriesIdBySiglaDocumentos(docs,status=[0,1]){
    docs = docs.replace(/\s/g, '').split(',')
    return this.findAll().whereIn('estado',status).whereIn('documento_id', Database.select('id').from('documentos').whereIn('sigla',docs)).with('documento').fetch()
  }

  async findSeriesByTipoFacturaca(docs, prefixo, status = [0, 1]) {
    docs = docs.replace(/\s/g, '').split(',');
    
    let query = this.findAll()
                    .whereIn('estado', status)
                    .whereIn('documento_id', Database.select('id').from('documentos').whereIn('sigla', docs))
                    .with('documento');

    query = prefixo === 'Normal' ? 
            query.whereNot('nome', 'like', `%IPLC%`).whereNot('nome', 'like', `%ICT%`) :
            query.where('nome', 'like', `%${prefixo}%`);

    return await query.fetch();
}


  findSeriesRecibosNotInLojas(){
    return this.findAll().where('estado',true).whereHas('documento',
     (builder) => {
      builder.where("sigla",'RC')}).whereNotIn('id', Database.select('serie_id_recibo')
      .from('lojas').whereNotNull("serie_id_recibo")).with('documento').fetch();
  }

  findSeriesNotInLojas(){
    return this.findAll().where('estado',true).whereHas('documento',
     (builder) => {
      builder.whereIn("sigla",['FR'])}).whereNotIn('id', Database.select('serie_id')
      .from('lojas').whereNotNull("serie_id")).with('documento').fetch();
  }

  findEstadoSerie(serie_id){
    return this.findAll().where('id',serie_id).where('estado',true).first();
  }
}
module.exports = SerieRepository
