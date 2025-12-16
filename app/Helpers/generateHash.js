const SerieRepository = use("App/Modules/Utilitarios/Repositories/SerieRepository");
const gearAss = use("App/Helpers/gearAss");
const Database = use('Database');
var numeral = require("numeral");
var moment = require("moment");
module.exports = async (total, serie_id, table) => {
    if (total || serie_id || table) {
      var serie = await new SerieRepository().findAll().with('documento').where('id',serie_id).first();
        serie = serie.toJSON()
        var factura_sigla = serie.documento.sigla + " " + serie.nome + "/" + serie.proximo_numero;

        var InvoiceDate = moment(new Date()).format("YYYY-MM-DD");
        var SystemEntryDate = moment(new Date()).format("YYYY-MM-DD") + "T" + moment(new Date()).format("HH:mm:ss");
        var createEntryDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        var InvoiceNo = factura_sigla;
        var GrossTotal = numeral(total).format("0.00");

        var hash = InvoiceDate + ";" + SystemEntryDate + ";" + InvoiceNo + ";" + GrossTotal + ";";
        const max_n = await Database.from(table).where("serie_id", serie_id).max("numero as total");
        var cc = (max_n[0].total == null ? 0 : max_n[0].total);
        if (cc != 0) {
            const doc_ant = await Database.select("hash as hash").from(table).where("serie_id", serie_id).where("numero", cc).first();
            hash = hash + "" + doc_ant.hash;
        }
        hash_string = hash;
        const signature =  gearAss(hash);
        return ({ hash: signature, factura_sigla: factura_sigla, proximo_numero: serie.proximo_numero, serie: serie, systemEntryDate: createEntryDate, hash_string });
    } else {
      return({
        err: "No file name provided",
      });
    }
};
