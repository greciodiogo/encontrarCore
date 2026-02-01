'use strict'

/**
 * Middleware Global de Tratamento de Erros
 * 
 * Intercepta todos os erros da aplicação e retorna mensagens amigáveis
 * ao cliente, evitando expor detalhes técnicos.
 */
class ErrorHandler {
  async handle({ request, response }, next) {
    try {
      // Continuar com a requisição
      await next()
    } catch (error) {
      // Log do erro completo no servidor (para debug)
      console.error('❌ [ErrorHandler] Erro capturado:')
      console.error('   URL:', request.url())
      console.error('   Method:', request.method())
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)

      // Determinar se estamos em desenvolvimento
      const isDevelopment = process.env.NODE_ENV === 'development'

      // Preparar resposta de erro
      let statusCode = 500
      let userMessage = 'Ocorreu um erro. Por favor, tente novamente.'
      let errorType = 'INTERNAL_ERROR'

      // Detectar tipo de erro e personalizar mensagem

      // 1. Erros de Banco de Dados (Knex, PostgreSQL, etc)
      if (this._isDatabaseError(error)) {
        statusCode = 503
        userMessage = 'Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.'
        errorType = 'DATABASE_ERROR'
      }
      
      // 2. Erros de Validação
      else if (this._isValidationError(error)) {
        statusCode = 400
        userMessage = error.message || 'Dados inválidos. Por favor, verifique as informações.'
        errorType = 'VALIDATION_ERROR'
      }
      
      // 3. Erros de Autenticação
      else if (this._isAuthError(error)) {
        statusCode = 401
        userMessage = 'Sessão expirada. Por favor, faça login novamente.'
        errorType = 'AUTH_ERROR'
      }
      
      // 4. Erros de Autorização
      else if (this._isAuthorizationError(error)) {
        statusCode = 403
        userMessage = 'Você não tem permissão para realizar esta ação.'
        errorType = 'AUTHORIZATION_ERROR'
      }
      
      // 5. Erros de Recurso Não Encontrado
      else if (this._isNotFoundError(error)) {
        statusCode = 404
        userMessage = 'Recurso não encontrado.'
        errorType = 'NOT_FOUND_ERROR'
      }
      
      // 6. Erros de Timeout
      else if (this._isTimeoutError(error)) {
        statusCode = 504
        userMessage = 'A requisição demorou muito tempo. Por favor, tente novamente.'
        errorType = 'TIMEOUT_ERROR'
      }
      
      // 7. Erros de Conexão Externa (APIs externas, Firebase, etc)
      else if (this._isExternalServiceError(error)) {
        statusCode = 503
        userMessage = 'Serviço externo indisponível. Por favor, tente novamente.'
        errorType = 'EXTERNAL_SERVICE_ERROR'
      }

      // Construir resposta
      const errorResponse = {
        success: false,
        message: userMessage,
        type: errorType,
        timestamp: new Date().toISOString()
      }

      // Em desenvolvimento, incluir detalhes técnicos
      if (isDevelopment) {
        errorResponse.debug = {
          originalMessage: error.message,
          stack: error.stack,
          url: request.url(),
          method: request.method()
        }
      }

      // Retornar resposta de erro
      return response.status(statusCode).json(errorResponse)
    }
  }

  /**
   * Detecta erros de banco de dados
   */
  _isDatabaseError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('knex') ||
      message.includes('timeout acquiring a connection') ||
      message.includes('econnrefused') ||
      message.includes('connection terminated') ||
      message.includes('database') ||
      message.includes('postgres') ||
      message.includes('sql') ||
      message.includes('relation') ||
      message.includes('column') ||
      message.includes('constraint')
    )
  }

  /**
   * Detecta erros de validação
   */
  _isValidationError(error) {
    const message = error.message.toLowerCase()
    return (
      error.name === 'ValidationException' ||
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('must be')
    )
  }

  /**
   * Detecta erros de autenticação
   */
  _isAuthError(error) {
    const message = error.message.toLowerCase()
    return (
      error.name === 'InvalidJwtToken' ||
      error.name === 'ExpiredJwtToken' ||
      message.includes('jwt') ||
      message.includes('token') ||
      message.includes('unauthenticated') ||
      message.includes('unauthorized') ||
      (error.status === 401)
    )
  }

  /**
   * Detecta erros de autorização
   */
  _isAuthorizationError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('forbidden') ||
      message.includes('permission') ||
      message.includes('not allowed') ||
      (error.status === 403)
    )
  }

  /**
   * Detecta erros de recurso não encontrado
   */
  _isNotFoundError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('not found') ||
      message.includes('does not exist') ||
      message.includes('não encontrado') ||
      (error.status === 404)
    )
  }

  /**
   * Detecta erros de timeout
   */
  _isTimeoutError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('timed out') ||
      message.includes('etimedout')
    )
  }

  /**
   * Detecta erros de serviços externos
   */
  _isExternalServiceError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('firebase') ||
      message.includes('external service') ||
      message.includes('api error') ||
      message.includes('service unavailable')
    )
  }
}

module.exports = ErrorHandler
