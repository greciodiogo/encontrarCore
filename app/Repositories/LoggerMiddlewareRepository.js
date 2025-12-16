'use strict'
const mongoose = require('mongoose')

const Env = use('Env')
const AuditMiddleware = use('App/Models/AuditMiddleware')

class LoggerMiddlewareRepository {


  static async register (_payload) {
    if(Env.get('CONFIG_TYPE_LOG') !='mongoose_db'){ 
      _payload.payload = JSON.stringify(_payload.payload);
      await AuditMiddleware.create(_payload);
    }else{
      return LoggerMiddlewareRepository.query(async () => {
        await AuditMiddleware.create(_payload)
      })
    }

  }


  static async getAllRecords (page = 1) {
    return LoggerRepository.query(async () => {
      const perPage = 10
      const skip = page * perPage - perPage
      const totalRecords = await AuditMiddleware.find().countDocuments()
      const logs = await AuditMiddleware.find().sort([['created_at', -1]]).skip(skip).limit(perPage)
      await mongoose.disconnect()

      return {
        page,
        lastPage: page === 1 ? 1 : page - 1,
        perPage,
        total: totalRecords,
        data: logs
      }
    })
  }

  static async findedById (id) {
    return LoggerRepository.query(async () => {
      const logs = await AuditMiddleware.find({ '_id': id })
      return logs
    })
  }

  static async query (callback) {
    return mongoose.connect(Env.get('MONGODB_URL'), { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        const result = await callback()
        await LoggerRepository.disconnect()
        return result
      })
  }

  static async disconnect () {
    await mongoose.disconnect()
  }
}

module.exports = LoggerMiddlewareRepository;
