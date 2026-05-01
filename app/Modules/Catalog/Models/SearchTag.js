'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SearchTag extends Model {
  static get table() {
    return 'search_tags'
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at'])
  }

  static get casts() {
    return {
      active: 'boolean',
      order: 'integer',
      click_count: 'integer'
    }
  }
}

module.exports = SearchTag
