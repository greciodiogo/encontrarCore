'use strict'
const mongoose = require('mongoose')

const Env = use('Env')
const Audit = use('App/Models/Audit')

class LoggerRepository {


  static async register (payload) {
    if(Env.get('CONFIG_TYPE_LOG') !='mongoose_db'){
      payload.user_data = JSON.stringify(payload.user_data),
      payload.old_data =  payload.old_data==null?null:JSON.stringify(payload.old_data),
      payload.new_data = JSON.stringify(payload.new_data);
      await Audit.create(payload);
    }else{
      return LoggerRepository.query(async () => {
        await Audit.create(payload)
      })
    }

  }


  static async getAllRecords (page = 1) {
    return LoggerRepository.query(async () => {
      const perPage = 10
      const skip = page * perPage - perPage
      const totalRecords = await Audit.find().countDocuments()
      const logs = await Audit.find().sort([['created_at', -1]]).skip(skip).limit(perPage)
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
      const logs = await Audit.find({ '_id': id })
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

module.exports = LoggerRepository
