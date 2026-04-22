'use strict'

const RequestAnalytics = use('App/Models/RequestAnalytics')
const Database = use('Database')

class AnalyticsController {
  /**
   * Dashboard geral de analytics
   * GET /api/analytics/dashboard
   */
  async dashboard({ request, response }) {
    try {
      const { days = 7 } = request.get()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      // Total de requisições
      const totalRequests = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .count('* as total')
      // Requis  ições por plataforma
      const byPlatform = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .select('platform')
        .count('* as total')
        .groupBy('platform')
        .orderBy('total', 'desc')

      // Requisições por dia
      const byDay = await Database
        .from('request_analytics')
        .where('created_at', '>=', startDate)
        .select(Database.raw('DATE(created_at) as date'))
        .count('* as total')
        .groupBy(Database.raw('DATE(created_at)'))
        .orderBy('date', 'asc')

      // Top endpoints
      const topEndpoints = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .select('endpoint', 'method')
        .count('* as total')
        .avg('response_time_ms as avg_response_time')
        .groupBy('endpoint', 'method')
        .orderBy('total', 'desc')
        .limit(10)

      // Versões de app mais usadas
      const appVersions = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .whereNotNull('app_version')
        .where('app_version', '!=', 'unknown')
        .select('app_version', 'platform')
        .count('* as total')
        .groupBy('app_version', 'platform')
        .orderBy('total', 'desc')
        .limit(10)

      // Taxa de erro
      const errorRate = await Database
        .from('request_analytics')
        .where('created_at', '>=', startDate)
        .select(
          Database.raw('COUNT(*) as total'),
          Database.raw('SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors')
        )
        .first()

      // Dispositivos mais usados
      const topDevices = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .whereNotNull('device_model')
        .where('device_model', '!=', 'unknown')
        .select('device_model', 'platform')
        .count('* as total')
        .groupBy('device_model', 'platform')
        .orderBy('total', 'desc')
        .limit(10)

      return response.json({
        success: true,
        data: {
          period: {
            days: parseInt(days),
            start_date: startDate,
            end_date: new Date()
          },
          summary: {
            total_requests: parseInt(totalRequests[0].total),
            error_rate: errorRate.total > 0 
              ? ((errorRate.errors / errorRate.total) * 100).toFixed(2) + '%'
              : '0%',
            total_errors: parseInt(errorRate.errors)
          },
          by_platform: byPlatform,
          by_day: byDay,
          top_endpoints: topEndpoints,
          app_versions: appVersions,
          top_devices: topDevices
        }
      })
    } catch (error) {
      console.error('❌ Erro ao buscar dashboard:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar analytics',
        error: error.message
      })
    }
  }

  /**
   * Analytics por plataforma específica
   * GET /api/analytics/platform/:platform
   */
  async byPlatform({ params, request, response }) {
    try {
      const { platform } = params
      const { days = 7 } = request.get()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      const analytics = await RequestAnalytics
        .query()
        .where('platform', platform)
        .where('created_at', '>=', startDate)
        .orderBy('created_at', 'desc')
        .paginate(request.input('page', 1), 50)

      const summary = await RequestAnalytics
        .query()
        .where('platform', platform)
        .where('created_at', '>=', startDate)
        .select(
          Database.raw('COUNT(*) as total'),
          Database.raw('AVG(response_time_ms) as avg_response_time'),
          Database.raw('MAX(response_time_ms) as max_response_time'),
          Database.raw('MIN(response_time_ms) as min_response_time')
        )
        .first()

      return response.json({
        success: true,
        data: {
          platform,
          summary,
          requests: analytics
        }
      })
    } catch (error) {
      console.error('❌ Erro ao buscar analytics por plataforma:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar analytics',
        error: error.message
      })
    }
  }

  /**
   * Comparar plataformas
   * GET /api/analytics/compare
   */
  async compare({ request, response }) {
    try {
      const { days = 7 } = request.get()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      const comparison = await Database
        .from('request_analytics')
        .where('created_at', '>=', startDate)
        .select('platform')
        .count('* as total_requests')
        .avg('response_time_ms as avg_response_time')
        .sum(Database.raw('CASE WHEN status_code >= 400 THEN 1 ELSE 0 END as errors'))
        .groupBy('platform')
        .orderBy('total_requests', 'desc')

      return response.json({
        success: true,
        data: comparison
      })
    } catch (error) {
      console.error('❌ Erro ao comparar plataformas:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao comparar plataformas',
        error: error.message
      })
    }
  }

  /**
   * Endpoints mais lentos
   * GET /api/analytics/slow-endpoints
   */
  async slowEndpoints({ request, response }) {
    try {
      const { days = 7, limit = 20 } = request.get()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      const slowEndpoints = await RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .select('endpoint', 'method', 'platform')
        .count('* as total_requests')
        .avg('response_time_ms as avg_response_time')
        .max('response_time_ms as max_response_time')
        .groupBy('endpoint', 'method', 'platform')
        .orderBy('avg_response_time', 'desc')
        .limit(parseInt(limit))

      return response.json({
        success: true,
        data: slowEndpoints
      })
    } catch (error) {
      console.error('❌ Erro ao buscar endpoints lentos:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar endpoints lentos',
        error: error.message
      })
    }
  }

  /**
   * Erros por plataforma
   * GET /api/analytics/errors
   */
  async errors({ request, response }) {
    try {
      const { days = 7, platform } = request.get()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      let query = RequestAnalytics
        .query()
        .where('created_at', '>=', startDate)
        .where('status_code', '>=', 400)

      if (platform) {
        query = query.where('platform', platform)
      }

      const errors = await query
        .select('endpoint', 'method', 'status_code', 'platform', 'error_message')
        .count('* as total')
        .groupBy('endpoint', 'method', 'status_code', 'platform', 'error_message')
        .orderBy('total', 'desc')
        .limit(50)

      return response.json({
        success: true,
        data: errors
      })
    } catch (error) {
      console.error('❌ Erro ao buscar erros:', error)
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar erros',
        error: error.message
      })
    }
  }
}

module.exports = AnalyticsController
