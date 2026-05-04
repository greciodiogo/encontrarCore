'use strict'

/**
 * Middleware para detectar e configurar o idioma da requisição
 * 
 * Prioridade:
 * 1. Query parameter: ?lang=en
 * 2. Header: Accept-Language
 * 3. Default: pt
 */
class LocaleMiddleware {
  async handle({ request, response }, next) {
    // 1. Verificar query parameter
    let locale = request.input('lang')
    
    // 2. Verificar header Accept-Language
    if (!locale) {
      const acceptLanguage = request.header('Accept-Language')
      if (acceptLanguage) {
        // Pegar primeiro idioma (ex: "en-US,en;q=0.9,pt;q=0.8" -> "en")
        locale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
      }
    }
    
    // 3. Validar idiomas suportados
    const supportedLocales = ['pt', 'en']
    if (!supportedLocales.includes(locale)) {
      locale = 'pt' // Default
    }
    
    // Adicionar locale ao request para uso nos controllers
    request.locale = locale
    
    // Adicionar helper para determinar campo de tradução
    request.getTranslatedField = (baseField) => {
      return locale === 'en' ? `${baseField}_en` : baseField
    }
    
    await next()
  }
}

module.exports = LocaleMiddleware
