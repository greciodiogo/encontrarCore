'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Banner extends Model {
  static boot() {
    super.boot();
    this.addTrait('@provider:Auditable');
  }

  static get table() {
    return 'banners'
  }

  /**
   * Scope para buscar apenas banners ativos
   */
  static scopeActive(query) {
    return query.where('is_active', true)
  }

  /**
   * Scope para ordenar por ordem de exibição
   */
  static scopeOrdered(query) {
    return query.orderBy('order', 'asc')
  }
}

module.exports = Banner
