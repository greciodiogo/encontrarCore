/**
 * @swagger
 * /api/notifications:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     summary: Listar todas as notificações do utilizador autenticado
 *     parameters:
 *       - name: page
 *         description: Número da página
 *         in: query
 *         type: integer
 *       - name: limit
 *         description: Quantidade de registos por página
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: Lista de notificações recuperada com sucesso
 *         example:
 *           data:
 *             - id: 1
 *               title: "Novo pedido"
 *               message: "Você recebeu um novo pedido #123"
 *               type: "order"
 *               is_read: false
 *               created_at: "2023-01-01T12:00:00.000Z"
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     summary: Criar uma nova notificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Novo pedido"
 *               message:
 *                 type: string
 *                 example: "Você recebeu um novo pedido #123"
 *               type:
 *                 type: string
 *                 example: "order"
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     summary: Obter detalhes de uma notificação
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Detalhes da notificação
 *         example:
 *           data:
 *             id: 1
 *             title: "Novo pedido"
 *             message: "Você recebeu um novo pedido #123"
 *             type: "order"
 *             is_read: false
 *             created_at: "2023-01-01T12:00:00.000Z"
 *       404:
 *         description: Notificação não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     summary: Atualizar uma notificação
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID da notificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Pedido atualizado"
 *               message:
 *                 type: string
 *                 example: "O status do seu pedido #123 foi atualizado"
 *               type:
 *                 type: string
 *                 example: "order"
 *               is_read:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Notificação não encontrada
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     summary: Excluir uma notificação
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Notificação não encontrada
 */

/**
 * @swagger
 * /api/notifications/device-token/register:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Firebase Push Notifications
 *     summary: Registrar token FCM para notificações push
 *     description: Registra ou atualiza um token de dispositivo FCM para receber notificações push
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "cVV2ZGZYMVZsTzpBUGExalJwcEJYODdPVmtoUm9PaW1wRVR..."
 *                 description: Token FCM do dispositivo
 *               device_name:
 *                 type: string
 *                 example: "iPhone 14 Pro"
 *                 description: Nome do dispositivo (opcional)
 *               device_type:
 *                 type: string
 *                 enum: ["mobile", "tablet", "web"]
 *                 example: "mobile"
 *                 description: "Tipo de dispositivo (padrão: mobile)"
 *     responses:
 *       201:
 *         description: Token registrado com sucesso
 *         example:
 *           message: "Token registrado com sucesso"
 *           data:
 *             id: 1
 *             token: "cVV2ZGZYMVZsTzpBUGExalJwcEJYODdPVmtoUm9PaW1wRVR..."
 *             device_name: "iPhone 14 Pro"
 *             device_type: "mobile"
 *       400:
 *         description: Dados inválidos
 *         example:
 *           message: "FCM token é obrigatório"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao registrar token
 */

/**
 * @swagger
 * /api/notifications/device-token/unregister:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Firebase Push Notifications
 *     summary: Deactivar um token FCM
 *     description: Remove ou desativa um token de dispositivo para parar de receber notificações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "cVV2ZGZYMVZsTzpBUGExalJwcEJYODdPVmtoUm9PaW1wRVR..."
 *                 description: Token FCM do dispositivo a remover
 *     responses:
 *       200:
 *         description: Token removido com sucesso
 *         example:
 *           message: "Token removido com sucesso"
 *       400:
 *         description: Token é obrigatório
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao remover token
 */

/**
 * @swagger
 * /api/notifications/device-token/list:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Firebase Push Notifications
 *     summary: Listar tokens FCM do utilizador
 *     description: Retorna lista de todos os tokens FCM registrados do utilizador autenticado
 *     responses:
 *       200:
 *         description: Lista de tokens recuperada com sucesso
 *         example:
 *           message: "Tokens listados com sucesso"
 *           data:
 *             - id: 1
 *               token: "cVV2ZGZYMVZsTzpBUGExalJwcEJYODdPVmtoUm9PaW1wRVR..."
 *               device_name: "iPhone 14 Pro"
 *               device_type: "mobile"
 *               created_at: "2023-01-01T12:00:00.000Z"
 *             - id: 2
 *               token: "dWZY3dlNZATaAPc2a3cPdU9PVmtoUm9PaW1wRVQ..."
 *               device_name: "iPad"
 *               device_type: "tablet"
 *               created_at: "2023-01-02T10:30:00.000Z"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao listar tokens
 */

/**
 * @swagger
 * /api/notifications/device-token/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Firebase Push Notifications
 *     summary: Obter detalhes de um token FCM
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: ID do token
 *     responses:
 *       200:
 *         description: Detalhes do token
 *         example:
 *           data:
 *             id: 1
 *             token: "cVV2ZGZYMVZsTzpBUGExalJwcEJYODdPVmtoUm9PaW1wRVR..."
 *             device_name: "iPhone 14 Pro"
 *             device_type: "mobile"
 *             is_active: true
 *             created_at: "2023-01-01T12:00:00.000Z"
 *             updated_at: "2023-01-01T12:00:00.000Z"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Token não encontrado
 *       500:
 *         description: Erro ao obter token
 */

/**
 * @swagger
 * /api/notifications/device-token/delete-all:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Firebase Push Notifications
 *     summary: Remover todos os tokens FCM
 *     description: Remove todos os tokens FCM registrados do utilizador autenticado
 *     responses:
 *       200:
 *         description: Todos os tokens foram removidos
 *         example:
 *           message: "Todos os tokens foram removidos"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao remover tokens
 */
