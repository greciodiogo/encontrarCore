'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

"use strict";

const NotAllowedException = use("App/Exceptions/NotAllowedException");
const InternalServerException = use("App/Exceptions/InternalServerException");
const Database = use("Database");
class AppDetector {
  async handle({ request }, next) {
    // var appKey = request.header('X-REQUEST-KEY');
    // var data = [];
    // try {
    //   data = await Database.select('key').from('application_keys').where('key', appKey).where('is_actived',1).where('is_deleted',0).limit(1);
    // } catch (error) {
    //   throw new InternalServerException('Erro: Config chave de acesso invalida!'+error);
    // }

    // if (data.length == 0)
    //   throw new NotAllowedException();
    //   await next();

    await next();
  }
}

module.exports = AppDetector;
