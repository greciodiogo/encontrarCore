'use strict'

class ShopBusinessHours {
  get rules() {
    return {
      'business_hours': 'required|array',
      'business_hours.*.day_of_week': 'required|integer|range:0,6',
      'business_hours.*.open_time': 'required|regex:^([0-1][0-9]|2[0-3]):([0-5][0-9])$',
      'business_hours.*.close_time': 'required|regex:^([0-1][0-9]|2[0-3]):([0-5][0-9])$',
      'business_hours.*.is_active': 'boolean'
    }
  }

  get messages() {
    return {
      'business_hours.required': 'O campo business_hours é obrigatório',
      'business_hours.array': 'O campo business_hours deve ser um array',
      'business_hours.*.day_of_week.required': 'O dia da semana é obrigatório',
      'business_hours.*.day_of_week.integer': 'O dia da semana deve ser um número inteiro',
      'business_hours.*.day_of_week.range': 'O dia da semana deve estar entre 0 (Domingo) e 6 (Sábado)',
      'business_hours.*.open_time.required': 'O horário de abertura é obrigatório',
      'business_hours.*.open_time.regex': 'O horário de abertura deve estar no formato HH:MM (ex: 08:00)',
      'business_hours.*.close_time.required': 'O horário de fechamento é obrigatório',
      'business_hours.*.close_time.regex': 'O horário de fechamento deve estar no formato HH:MM (ex: 17:00)',
      'business_hours.*.is_active.boolean': 'O campo is_active deve ser verdadeiro ou falso'
    }
  }

  get sanitizationRules() {
    return {
      'business_hours.*.day_of_week': 'to_int',
      'business_hours.*.is_active': 'to_boolean'
    }
  }
}

module.exports = ShopBusinessHours
