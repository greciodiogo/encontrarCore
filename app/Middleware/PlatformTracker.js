'use strict'

const RequestAnalytics = use('App/Models/RequestAnalytics')
const { v4: uuidv4 } = require('uuid')

class PlatformTracker {
  async handle({ request, response, auth }, next) {
    const startTime = Date.now()
    const requestId = uuidv4()
    
    // Adicionar request ID ao contexto
    request.requestId = requestId
    
    // Extrair informações da requisição
    const userAgent = request.header('user-agent') || ''
    const platform = this.detectPlatform(request, userAgent)
    const platformDetails = this.extractPlatformDetails(request, userAgent, platform)
    
    // Continuar com a requisição
    await next()
    
    // Calcular tempo de resposta
    const responseTime = Date.now() - startTime
    
    // Salvar analytics de forma assíncrona (não bloqueia resposta)
    this.saveAnalytics({
      requestId,
      request,
      response,
      auth,
      userAgent,
      platform,
      platformDetails,
      responseTime
    }).catch(error => {
      console.error('❌ Erro ao salvar analytics:', error.message)
    })
  }

  /**
   * Detectar plataforma baseado em headers customizados e user-agent
   */
  detectPlatform(request, userAgent) {
    // 1. Verificar header customizado (mais confiável)
    const customPlatform = request.header('X-Platform')
    if (customPlatform) {
      return customPlatform.toLowerCase()
    }

    // 2. Verificar header de client type
    const clientType = request.header('X-Client-Type')
    if (clientType) {
      return clientType.toLowerCase()
    }

    // 3. Detectar por User-Agent
    const ua = userAgent.toLowerCase()
    
    if (ua.includes('postman')) return 'postman'
    if (ua.includes('insomnia')) return 'insomnia'
    if (ua.includes('curl')) return 'curl'
    
    // Mobile apps
    if (ua.includes('encontrar-android') || ua.includes('android')) return 'android'
    if (ua.includes('encontrar-ios') || ua.includes('iphone') || ua.includes('ipad')) return 'ios'
    
    // Web browsers
    if (ua.includes('chrome')) return 'web-chrome'
    if (ua.includes('firefox')) return 'web-firefox'
    if (ua.includes('safari') && !ua.includes('chrome')) return 'web-safari'
    if (ua.includes('edge')) return 'web-edge'
    
    return 'unknown'
  }

  /**
   * Extrair detalhes da plataforma
   */
  extractPlatformDetails(request, userAgent, platform) {
    return {
      appVersion: request.header('X-App-Version') || request.header('App-Version') || 'unknown',
      platformVersion: this.extractPlatformVersion(userAgent, platform),
      deviceModel: request.header('X-Device-Model') || this.extractDeviceModel(userAgent),
      osVersion: request.header('X-OS-Version') || this.extractOSVersion(userAgent),
      clientType: request.header('X-Client-Type') || this.inferClientType(platform)
    }
  }

  /**
   * Extrair versão da plataforma do User-Agent
   */
  extractPlatformVersion(userAgent, platform) {
    const ua = userAgent.toLowerCase()
    
    // Android
    if (platform === 'android') {
      const match = ua.match(/android\s+([\d.]+)/)
      return match ? `Android ${match[1]}` : 'Android'
    }
    
    // iOS
    if (platform === 'ios') {
      const match = ua.match(/os\s+([\d_]+)/)
      return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS'
    }
    
    // Chrome
    if (platform.includes('chrome')) {
      const match = ua.match(/chrome\/([\d.]+)/)
      return match ? `Chrome ${match[1]}` : 'Chrome'
    }
    
    return 'unknown'
  }

  /**
   * Extrair modelo do dispositivo
   */
  extractDeviceModel(userAgent) {
    // Tentar extrair modelo do User-Agent
    const ua = userAgent
    
    // iPhone models
    const iphoneMatch = ua.match(/iPhone\s*(\d+[,\d]*)?/)
    if (iphoneMatch) return iphoneMatch[0]
    
    // iPad models
    const ipadMatch = ua.match(/iPad\s*(\d+[,\d]*)?/)
    if (ipadMatch) return ipadMatch[0]
    
    // Android models (mais complexo)
    const androidMatch = ua.match(/\(([^)]+)\)/)
    if (androidMatch && androidMatch[1].includes('Build')) {
      const parts = androidMatch[1].split(';')
      if (parts.length >= 2) {
        return parts[1].trim().split('Build')[0].trim()
      }
    }
    
    return 'unknown'
  }

  /**
   * Extrair versão do OS
   */
  extractOSVersion(userAgent) {
    const ua = userAgent.toLowerCase()
    
    // Android
    const androidMatch = ua.match(/android\s+([\d.]+)/)
    if (androidMatch) return androidMatch[1]
    
    // iOS
    const iosMatch = ua.match(/os\s+([\d_]+)/)
    if (iosMatch) return iosMatch[1].replace(/_/g, '.')
    
    return 'unknown'
  }

  /**
   * Inferir tipo de cliente
   */
  inferClientType(platform) {
    if (platform === 'android' || platform === 'ios') return 'mobile-app'
    if (platform.startsWith('web-')) return 'web-app'
    if (['postman', 'insomnia', 'curl'].includes(platform)) return 'api-client'
    return 'unknown'
  }

  /**
   * Salvar analytics no banco de dados
   */
  async saveAnalytics({ requestId, request, response, auth, userAgent, platform, platformDetails, responseTime }) {
    try {
      // Obter user ID se autenticado
      let userId = null
      try {
        const user = await auth.getUser()
        userId = user ? user.id : null
      } catch (error) {
        // Usuário não autenticado
      }

      // Extrair IP
      const ipAddress = request.ip() || request.header('x-forwarded-for') || 'unknown'

      // Headers importantes (filtrar sensíveis)
      const importantHeaders = {
        'x-platform': request.header('X-Platform'),
        'x-app-version': request.header('X-App-Version'),
        'x-device-model': request.header('X-Device-Model'),
        'x-client-type': request.header('X-Client-Type'),
        'accept': request.header('accept'),
        'content-type': request.header('content-type')
      }

      // Query params (remover sensíveis)
      const queryParams = { ...request.get() }
      delete queryParams.password
      delete queryParams.token
      delete queryParams.api_key

      await RequestAnalytics.create({
        request_id: requestId,
        method: request.method(),
        endpoint: request.url(),
        status_code: response.response.statusCode,
        response_time_ms: responseTime,
        
        platform: platform,
        platform_version: platformDetails.platformVersion,
        app_version: platformDetails.appVersion,
        device_model: platformDetails.deviceModel,
        os_version: platformDetails.osVersion,
        
        user_agent: userAgent,
        client_type: platformDetails.clientType,
        
        ip_address: ipAddress,
        user_id: userId,
        
        request_headers: importantHeaders,
        query_params: Object.keys(queryParams).length > 0 ? queryParams : null,
        error_message: response.response.statusCode >= 400 ? response.response.statusMessage : null
      })

    } catch (error) {
      // Não deixar erro de analytics quebrar a aplicação
      console.error('❌ Erro ao salvar request analytics:', error.message)
    }
  }
}

module.exports = PlatformTracker
