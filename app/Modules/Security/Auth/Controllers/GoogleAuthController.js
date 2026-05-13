'use strict'

const { OAuth2Client } = require('google-auth-library');
const UsersService = use('App/Modules/Authentication/Services/UsersService');
const DeviceTokenService = use('App/Modules/Authentication/Services/DeviceTokenService');
const Env = use('Env');
const Hash = use('Hash');
const crypto = require('crypto');

/**
 * Controller para autenticação com Google
 * Endpoint: POST /api/auth/google
 */
class GoogleAuthController {
  
  /**
   * Autenticar com Google usando idToken
   * @param {Object} ctx - context
   * @param {Request} ctx.request - request
   * @param {Response} ctx.response - response
   * @param {Auth} ctx.auth - auth
   */
  async googleLogin({ request, response, auth }) {
    const { idToken, fcm_token, device_name, device_type } = request.all();

    console.log('🔐 [GOOGLE AUTH] Iniciando login com Google...', {
      hasIdToken: !!idToken,
      hasFcmToken: !!fcm_token,
      deviceName: device_name,
      deviceType: device_type
    });

    if (!idToken) {
      return response.badRequest({
        message: 'idToken é obrigatório'
      });
    }

    try {
      // 1. Verificar idToken com Google
      const client = new OAuth2Client();
      
      // Aceitar múltiplos Client IDs (iOS, Android, Web)
      const googleClientIds = [
        Env.get('GOOGLE_CLIENT_ID'), // Android
        '35875106082-b921hse6d9afj2snkhp00nfhuu5ud559.apps.googleusercontent.com', // iOS
        '595810896987-t259a3bmiujn0938cc4ujv2ukfs8camq.apps.googleusercontent.com', // Web
      ].filter(Boolean); // Remove undefined/null
      
      console.log('🔍 [GOOGLE AUTH] Verificando idToken com Google...');
      console.log('   Client IDs aceitos:', googleClientIds);
      
      // Tentar verificar com cada Client ID
      let ticket = null;
      let lastError = null;
      
      for (const clientId of googleClientIds) {
        try {
          ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
          });
          console.log(`✅ [GOOGLE AUTH] Token verificado com Client ID: ${clientId}`);
          break; // Sucesso, sair do loop
        } catch (err) {
          console.log(`⚠️  [GOOGLE AUTH] Falha com Client ID ${clientId}: ${err.message}`);
          lastError = err;
          continue; // Tentar próximo Client ID
        }
      }
      
      if (!ticket) {
        console.error('❌ [GOOGLE AUTH] Token não pôde ser verificado com nenhum Client ID');
        throw lastError || new Error('Token inválido');
      }

      const payload = ticket.getPayload();
      console.log('✅ [GOOGLE AUTH] Token verificado:', {
        email: payload.email,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name
      });

      if (!payload?.email) {
        console.error('❌ [GOOGLE AUTH] Email não encontrado no token');
        return response.unauthorized({
          message: 'Email não encontrado no token do Google'
        });
      }

      // 2. Verificar se usuário existe (incluindo contas deletadas)
      let user = await new UsersService().findUsersByEmail(payload.email, null, true);

      if (user) {
        // Se a conta foi deletada, reativar
        if (user.is_deleted) {
          console.log('♻️  [GOOGLE AUTH] Reativando conta deletada:', user.id);
          
          const Database = use('Database');
          await Database
            .table('users')
            .where('id', user.id)
            .update({
              is_deleted: false,
              firstName: payload.given_name || payload.name?.split(' ')[0] || 'User',
              lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || ''
            });
          
          // Buscar usuário atualizado
          user = await new UsersService().findUsersByEmail(payload.email, null, false);
          console.log('✅ [GOOGLE AUTH] Conta reativada:', user.id);
        } else {
          console.log('👤 [GOOGLE AUTH] Usuário existente:', user.id);
        }
      } else {
        // 3. Criar novo usuário se não existir
        console.log('📝 [GOOGLE AUTH] Criando novo usuário...');
        
        // Gerar senha aleatória para usuários Google
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await Hash.make(randomPassword);

        user = await new UsersService().createUser({
          email: payload.email,
          firstName: payload.given_name || payload.name?.split(' ')[0] || 'User',
          lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
          password: hashedPassword,
          role: 'customer'
        });

        console.log('✅ [GOOGLE AUTH] Novo usuário criado:', user.id);
      }

      // 4. Gerar JWT token usando o sistema de autenticação do AdonisJS
      console.log('🔑 [GOOGLE AUTH] Gerando JWT token...');
      
      // Usar o método generate do auth para criar token sem senha
      const token = await auth
        .withRefreshToken()
        .generate(user);

      console.log('✅ [GOOGLE AUTH] Token gerado com sucesso');

      // 5. Registrar FCM token se fornecido
      if (fcm_token && user.id) {
        console.log('📱 [GOOGLE AUTH] Registrando FCM token...');
        try {
          await new DeviceTokenService().registerToken(
            user.id,
            fcm_token,
            device_name || 'Mobile Device',
            device_type || 'mobile'
          );
          console.log('✅ [GOOGLE AUTH] FCM token registrado');
        } catch (tokenError) {
          console.error('❌ [GOOGLE AUTH] Erro ao registrar FCM token:', tokenError.message);
          // Não bloqueia o login se falhar o registro do token
        }
      }

      // 6. Preparar resposta no formato esperado pela app mobile
      const responseData = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          default_phone: user.default_phone,
          default_payment: user.default_payment,
          default_city: user.default_city,
          default_address: user.default_address
        },
        token: token
      };

      console.log('🎉 [GOOGLE AUTH] Login com Google concluído com sucesso!');

      return response.ok(responseData, {
        message: 'Login com Google realizado com sucesso'
      });

    } catch (error) {
      console.error('❌ [GOOGLE AUTH] Erro:', error.message);
      console.error('Stack:', error.stack);

      if (error.message?.includes('Token used too late') || error.message?.includes('Invalid token')) {
        return response.unauthorized({
          message: 'Token do Google inválido ou expirado'
        });
      }

      return response.internalServerError({
        message: 'Erro ao processar login com Google',
        error: error.message
      });
    }
  }
}

module.exports = GoogleAuthController;
