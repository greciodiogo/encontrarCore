'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // Dashboard geral
  Route.get('/dashboard', 'AnalyticsController.dashboard')
  
  // Analytics por plataforma
  Route.get('/platform/:platform', 'AnalyticsController.byPlatform')
  
  // Comparar plataformas
  Route.get('/compare', 'AnalyticsController.compare')
  
  // Endpoints mais lentos
  Route.get('/slow-endpoints', 'AnalyticsController.slowEndpoints')
  
  // Erros
  Route.get('/errors', 'AnalyticsController.errors')
  
}).prefix('api/analytics').middleware(['auth']) // Proteger com autenticação

module.exports = Route
