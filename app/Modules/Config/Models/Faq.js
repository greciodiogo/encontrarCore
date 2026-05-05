'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Faq extends Model {
  static get table() {
    return 'faqs'
  }

  static get fillable() {
    return [
      'question',
      'answer',
      'question_en',
      'answer_en',
      'category',
      'order',
      'is_active'
    ]
  }

  static get casts() {
    return {
      is_active: 'boolean',
      order: 'integer'
    }
  }
}

module.exports = Faq
