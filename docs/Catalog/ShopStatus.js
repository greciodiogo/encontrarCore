/**
 * @swagger
 * /api/shops/{id}/status:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Status
 *     summary: Obter status atual da loja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Status da loja obtido com sucesso
 *       400:
 *         description: Erro ao obter status
 */

/**
 * @swagger
 * /api/shops/{id}/status:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Status
 *     summary: Definir status manual da loja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PAUSED, MANUALLY_CLOSED]
 *                 description: Status manual (PAUSED ou MANUALLY_CLOSED)
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar status
 */

/**
 * @swagger
 * /api/shops/{id}/status:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Status
 *     summary: Remover override manual e voltar ao status automático
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Override removido com sucesso
 *       400:
 *         description: Erro ao remover override
 */

/**
 * @swagger
 * /api/shops/{id}/business-hours:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Business Hours
 *     summary: Listar horários de funcionamento da loja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Horários obtidos com sucesso
 *       400:
 *         description: Erro ao obter horários
 */

/**
 * @swagger
 * /api/shops/{id}/business-hours:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Business Hours
 *     summary: Criar horários de funcionamento para a loja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - business_hours
 *             properties:
 *               business_hours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day_of_week
 *                     - open_time
 *                     - close_time
 *                   properties:
 *                     day_of_week:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 6
 *                       description: Dia da semana (0=Domingo, 6=Sábado)
 *                     open_time:
 *                       type: string
 *                       pattern: '^([0-1][0-9]|2[0-3]):([0-5][0-9])$'
 *                       example: "08:00"
 *                       description: Hora de abertura (formato HH:MM)
 *                     close_time:
 *                       type: string
 *                       pattern: '^([0-1][0-9]|2[0-3]):([0-5][0-9])$'
 *                       example: "17:00"
 *                       description: Hora de fechamento (formato HH:MM)
 *                     is_active:
 *                       type: boolean
 *                       default: true
 *                       description: Se o horário está ativo
 *     responses:
 *       201:
 *         description: Horários criados com sucesso
 *       400:
 *         description: Erro ao criar horários
 */

/**
 * @swagger
 * /api/shops/{shopId}/business-hours/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Business Hours
 *     summary: Atualizar horário de funcionamento
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day_of_week:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *               open_time:
 *                 type: string
 *                 pattern: '^([0-1][0-9]|2[0-3]):([0-5][0-9])$'
 *               close_time:
 *                 type: string
 *                 pattern: '^([0-1][0-9]|2[0-3]):([0-5][0-9])$'
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Horário atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar horário
 */

/**
 * @swagger
 * /api/shops/{shopId}/business-hours/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Business Hours
 *     summary: Deletar horário de funcionamento
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário
 *     responses:
 *       200:
 *         description: Horário deletado com sucesso
 *       400:
 *         description: Erro ao deletar horário
 */

/**
 * @swagger
 * /api/shops/{id}/business-hours:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shop Business Hours
 *     summary: Deletar todos os horários de funcionamento da loja
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Horários deletados com sucesso
 *       400:
 *         description: Erro ao deletar horários
 */
