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
 * /api/auth/logout:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     summary: Fazer logout
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
