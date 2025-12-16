'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DashboardRepository = use("App/Modules/Utilitarios/Repositories/DashboardRepository");

/**
 * Resourceful controller for interacting with dashboards
 */
class DashboardController {
  /**
   * Show a list of all dashboards.
   * GET dashboards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async findDashboardInit ({ request, response, view }) {
      const data = await new DashboardRepository().findDashboardInit();
      return response.ok(data);
  }

}

module.exports = DashboardController
