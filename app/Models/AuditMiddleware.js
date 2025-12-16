'use strict'

const Env = use('Env')
const mongoose = require('mongoose');



/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AuditMiddleware extends Model {
    static get table () {
        return 'logs_middleware'
    }
}

module.exports = Env.get('CONFIG_TYPE_LOG') =='mongoose_db'? mongoose.model('logs_middleware', { 
  "event": String, 
  "action": String,
  "ip": String,
  "message": String,
  "statusCode": Number,
  "url": String, 
  "payload": Object,
  "created_at": Date
}) : AuditMiddleware;