
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const UsersService = use('App/Modules/Authentication/Services/UsersService')
/**
 * Resourceful controller for interacting with icttrunkouts
 */
class UsersController{
  /**
   * Show a list of all icttrunkouts.
   * GET icttrunkouts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   
   */
  async index ({ request, response,  }) { 
    const filters = request;
    const data = await new UsersService().findAllUserss(filters);
    return response.ok(data);
  } 
  /**
   * Create/save a new icttrunkout.
   * POST icttrunkouts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const ModelPayload = request.all();
    const data = await new UsersService().createUser({...ModelPayload});
    return response.created(data, {message: "Registo efectuado com sucesso"});
  }

  /**
   * Display a single icttrunkout.
   * GET icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   
   */
  async show ({ params, response  }) {
    const Id = params.id;
    const data = await new UsersService().findUsersById(Id);
    return response.ok(data);
  }

  /**
   * Update icttrunkout details.
   * PUT or PATCH icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const ModelPayload = request.all();
    const Id = params.id;
    const data = await new UsersService().updatedUsers(Id, ModelPayload);
    return response.ok(data, {message: "Registo actualizado com sucesso"});
  }

  /**
   * Delete a icttrunkout with id.
   * DELETE icttrunkouts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) { 
    const Id = params.id;
    const data = await new UsersService().deleteTemporarilyUsers(Id);
    return response.ok(data, {message: "Registo excluido com sucesso"});
  }

  /**
   * Upload profile photo for user
   * POST /api/users/:id/profile-photo
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async uploadProfilePhoto ({ params, request, response, auth }) {
    try {
      const userId = params.id;
      const { photoUrl } = request.all();

      console.log('📸 [PROFILE PHOTO] Upload iniciado:', {
        userId,
        photoUrl: photoUrl?.substring(0, 50) + '...'
      });

      // Validar que o usuário está autenticado e é o dono do perfil
      if (!auth.user || auth.user.id !== parseInt(userId)) {
        console.error('❌ [PROFILE PHOTO] Usuário não autorizado');
        return response.unauthorized({
          message: 'Você não tem permissão para atualizar este perfil'
        });
      }

      if (!photoUrl) {
        return response.badRequest({
          message: 'URL da foto é obrigatória'
        });
      }

      // Atualizar URL da foto no banco de dados
      const data = await new UsersService().updatedUsers(userId, {
        profile_photo_url: photoUrl
      });

      console.log('✅ [PROFILE PHOTO] Foto atualizada com sucesso');

      return response.ok(data, {
        message: 'Foto de perfil atualizada com sucesso'
      });

    } catch (error) {
      console.error('❌ [PROFILE PHOTO] Erro:', error.message);
      return response.internalServerError({
        message: 'Erro ao atualizar foto de perfil',
        error: error.message
      });
    }
  }
}

module.exports = UsersController
    