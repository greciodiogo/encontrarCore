'use strict'

/**
 * Helper para lidar com traduções no banco de dados
 */
class TranslationHelper {
  /**
   * Retorna o nome do campo traduzido baseado no locale
   * 
   * @param {string} baseField - Nome do campo base (ex: 'name', 'description')
   * @param {string} locale - Código do idioma (ex: 'pt', 'en')
   * @returns {string} - Nome do campo traduzido (ex: 'name_en')
   */
  static getFieldName(baseField, locale = 'pt') {
    return locale === 'en' ? `${baseField}_en` : baseField
  }

  /**
   * Retorna SQL para selecionar campo traduzido com fallback
   * 
   * Exemplo: COALESCE(name_en, name) as name
   * 
   * @param {string} baseField - Nome do campo base
   * @param {string} locale - Código do idioma
   * @param {string} alias - Alias para o campo (opcional)
   * @returns {string} - SQL para select
   */
  static getSelectSQL(baseField, locale = 'pt', alias = null) {
    const translatedField = this.getFieldName(baseField, locale)
    const fieldAlias = alias || baseField
    
    if (locale === 'en') {
      // Usar tradução se existir, senão usar campo original
      return `COALESCE(${translatedField}, ${baseField}) as ${fieldAlias}`
    }
    
    // Para PT, usar campo original
    return `${baseField} as ${fieldAlias}`
  }

  /**
   * Adiciona campos traduzidos a um objeto
   * 
   * @param {object} item - Objeto com dados
   * @param {array} fields - Campos para traduzir
   * @param {string} locale - Código do idioma
   * @returns {object} - Objeto com campos traduzidos
   */
  static translateObject(item, fields = ['name', 'description'], locale = 'pt') {
    if (!item || locale === 'pt') {
      return item
    }

    const translated = { ...item }

    fields.forEach(field => {
      const translatedField = `${field}_en`
      // Verificar se o campo traduzido existe (não apenas se é truthy)
      if (item[translatedField] !== undefined && item[translatedField] !== null) {
        translated[field] = item[translatedField]
      }
    })

    return translated
  }

  /**
   * Adiciona campos traduzidos a um array de objetos
   * 
   * @param {array} items - Array de objetos
   * @param {array} fields - Campos para traduzir
   * @param {string} locale - Código do idioma
   * @returns {array} - Array com objetos traduzidos
   */
  static translateArray(items, fields = ['name', 'description'], locale = 'pt') {
    if (!items || !Array.isArray(items) || locale === 'pt') {
      return items
    }

    return items.map(item => this.translateObject(item, fields, locale))
  }

  /**
   * Remove campos de tradução do objeto (para limpar resposta)
   * 
   * @param {object} item - Objeto com dados
   * @param {array} fields - Campos base
   * @returns {object} - Objeto sem campos _en
   */
  static cleanTranslationFields(item, fields = ['name', 'description']) {
    if (!item) {
      return item
    }

    const cleaned = { ...item }

    fields.forEach(field => {
      delete cleaned[`${field}_en`]
    })

    return cleaned
  }

  /**
   * Retorna o valor traduzido de um campo específico
   * 
   * @param {object} item - Objeto com dados
   * @param {string} field - Nome do campo
   * @param {string} locale - Código do idioma
   * @returns {string} - Valor traduzido ou original
   */
  static translateField(item, field, locale = 'pt') {
    if (!item || locale === 'pt') {
      return item[field]
    }

    const translatedField = `${field}_en`
    return item[translatedField] || item[field]
  }
}

module.exports = TranslationHelper
