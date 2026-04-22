'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RequestAnalytics extends Model {
  static get table() {
    return 'request_analytics'
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at'])
  }

  static get hidden() {
    return ['request_headers']
  }

  // Relacionamento com usuário
  user() {
    return this.belongsTo('App/Modules/Security/Users/Models/User')
  }

  // Scopes para queries comuns
  static scopeByPlatform(query, platform) {
    return query.where('platform', platform)
  }

  static scopeByDateRange(query, startDate, endDate) {
    return query.whereBetween('created_at', [startDate, endDate])
  }

  static scopeByEndpoint(query, endpoint) {
    return query.where('endpoint', 'like', `%${endpoint}%`)
  }

  static scopeSuccessful(query) {
    return query.whereBetween('status_code', [200, 299])
  }

  static scopeErrors(query) {
    return query.where('status_code', '>=', 400)
  }
}

module.exports = RequestAnalytics
