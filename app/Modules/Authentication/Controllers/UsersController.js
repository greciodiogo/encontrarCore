
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

      console.log('📸 [PROFILE PHOTO] Upload iniciado para usuário:', userId);

      // Validar que o usuário está autenticado e é o dono do perfil
      if (!auth.user || auth.user.id !== parseInt(userId)) {
        console.error('❌ [PROFILE PHOTO] Usuário não autorizado');
        return response.unauthorized({
          message: 'Você não tem permissão para atualizar este perfil'
        });
      }

      // Get uploaded file (mesmo padrão do ProductPhotosController)
      const photo = request.file('photo', {
        types: ['image'],
        size: '5mb'
      });

      if (!photo) {
        console.error('❌ [PROFILE PHOTO] Nenhum arquivo recebido');
        return response.badRequest({
          message: 'Nenhuma foto foi enviada'
        });
      }

      console.log('📁 [PROFILE PHOTO] Arquivo recebido:', {
        clientName: photo.clientName,
        size: photo.size,
        type: photo.type,
        subtype: photo.subtype,
        extname: photo.extname
      });

      // Upload to Supabase
      const Env = use('Env');
      const { createClient } = require('@supabase/supabase-js');
      
      const supabaseUrl = Env.get('SUPABASE_URL');
      const supabaseKey = Env.get('SUPABASE_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ [PROFILE PHOTO] Configuração Supabase não encontrada');
        throw new Error('Configuração do Supabase não encontrada');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Generate unique filename
      const timestamp = Date.now();
      const extension = photo.extname || 'jpg';
      const fileName = `profile_${userId}_${timestamp}.${extension}`;
      const filePath = `profile-photos/${fileName}`;

      console.log('☁️  [PROFILE PHOTO] Fazendo upload para Supabase:', filePath);

      // Read file buffer
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(photo.tmpPath);

      console.log('📦 [PROFILE PHOTO] Buffer lido:', fileBuffer.length, 'bytes');

      // Upload to Supabase Storage (bucket: uploads)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, fileBuffer, {
          contentType: photo.type + '/' + photo.subtype,
          upsert: true
        });

      if (uploadError) {
        console.error('❌ [PROFILE PHOTO] Erro no upload Supabase:', uploadError);
        throw uploadError;
      }

      console.log('✅ [PROFILE PHOTO] Upload Supabase concluído:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;

      console.log('🔗 [PROFILE PHOTO] URL pública:', photoUrl);

      // Update user record
      const updatedUser = await new UsersService().updatedUsers(userId, {
        profile_photo_url: photoUrl
      });

      console.log('✅ [PROFILE PHOTO] Registro atualizado com sucesso');

      return response.ok({
        profile_photo_url: photoUrl,
        user: updatedUser
      }, {
        message: 'Foto de perfil atualizada com sucesso'
      });

    } catch (error) {
      console.error('❌ [PROFILE PHOTO] Erro:', error.message);
      console.error('Stack:', error.stack);
      
      return response.internalServerError({
        message: 'Erro ao atualizar foto de perfil',
        error: error.message
      });
    }
  }
}

module.exports = UsersController
    