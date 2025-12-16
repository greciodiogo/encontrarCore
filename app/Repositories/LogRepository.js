
class LogRepository extends BaseRepository{
   /**
   * Show a list of all LogRepository.
   * GET LogRepository
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async findAll (search, filters) {
  }

  /**
   * Render a form to be used for creating a new log.
   * GET LogRepository/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response 
   */
  async create (request) {
  }
  
  /**
   * Display a single log.
   * GET LogRepository/:id
   *
   * @param {object} ctx 
   */
  async find (id) {
  }
 
  /**
   * Update log details.
   * PUT or PATCH LogRepository/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request 
   */
  async update (id, request) {
  }

  /**
   * Delete a log with id.
   * DELETE LogRepository/:id
   * 
   */
  async delete (id) {
  }
}    
module.exports = LogRepository
    