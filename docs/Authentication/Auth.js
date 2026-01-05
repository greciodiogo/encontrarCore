/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Autenticar utilizador
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *             password:
 *               type: string
 *               format: password
 *               example: "123456"
 *             fcm_token:
 *               type: string
 *               example: "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX"
 *               description: "Token FCM do dispositivo (opcional - registra automaticamente o token para push notifications)"
 *             device_name:
 *               type: string
 *               example: "iPhone 12"
 *               description: "Nome do dispositivo (opcional, usado com fcm_token)"
 *             device_type:
 *               type: string
 *               enum: ["mobile", "tablet", "web"]
 *               example: "mobile"
 *               description: "Tipo de dispositivo (opcional, padrão: mobile)"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT Token
 *             refreshToken:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Credenciais inválidas
 *       404:
 *         description: Utilizador não encontrado
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Registar novo utilizador
 *     description: Criar uma nova conta de utilizador com email e password
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *             - password_confirmation
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: newuser@example.com
 *             password:
 *               type: string
 *               format: password
 *               example: "SecurePassword123"
 *               description: Mínimo 6 caracteres
 *             password_confirmation:
 *               type: string
 *               format: password
 *               example: "SecurePassword123"
 *               description: Deve corresponder ao campo password
 *             fcm_token:
 *               type: string
 *               example: "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX"
 *               description: "Token FCM do dispositivo (opcional - registra automaticamente o token para push notifications)"
 *             device_name:
 *               type: string
 *               example: "iPhone 12"
 *               description: "Nome do dispositivo (opcional, usado com fcm_token)"
 *             device_type:
 *               type: string
 *               enum: ["mobile", "tablet", "web"]
 *               example: "mobile"
 *               description: "Tipo de dispositivo (opcional, padrão: mobile)"
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Utilizador criado com sucesso"
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou email já registado
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Email já existe na base de dados"
 *       422:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     summary: Fazer logout
 *     parameters:
 *       - name: body
 *         in: body
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             fcm_token:
 *               type: string
 *               example: "eUdcqsqPMXN5c3X7PYbDQA:APA91bXXXXXXXXXXXXXXXX"
 *               description: "Token FCM do dispositivo (opcional - desregistra automaticamente o token)"
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     summary: Obter dados do utilizador autenticado
 *     responses:
 *       200:
 *         description: Dados do utilizador
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Renovar token de acesso
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - refresh_token
 *           properties:
 *             refresh_token:
 *               type: string
 *               description: Refresh token obtido no login
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Novo JWT Token
 *       401:
 *         description: Refresh token inválido
 */

/**
 * @swagger
 * /api/auth/password/updatePassword:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     summary: Atualizar senha do utilizador
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - old_password
 *             - new_password
 *             - new_password_confirmation
 *           properties:
 *             old_password:
 *               type: string
 *               format: password
 *             new_password:
 *               type: string
 *               format: password
 *             new_password_confirmation:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Senha antiga incorreta ou senhas não coincidem
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/auth/recover-password-sending-email:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Enviar email de recuperação de senha
 *     parameters:
 *       - name: email
 *         description: Email do utilizador
 *         in: query
 *         required: true
 *         type: string
 *         format: email
 *     responses:
 *       200:
 *         description: Email de recuperação enviado com sucesso
 *       404:
 *         description: Utilizador não encontrado
 */
