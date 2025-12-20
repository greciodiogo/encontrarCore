/**
 * @swagger
 * /api/shops:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shops
 *     summary: Listar todas as lojas
 *     parameters:
 *       - name: page
 *         description: Número da página
 *         in: query
 *         type: integer
 *         default: 1
 *       - name: perPage
 *         description: Quantidade de registos por página
 *         in: query
 *         type: integer
 *         default: 10
 *       - name: search
 *         description: Pesquisar por nome
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Lista de lojas recuperada com sucesso
 *         example:
 *           data:
 *             - id: 1
 *               name: "Loja Centro"
 *               address: "Rua Principal, 123"
 *               city: "Lisboa"
 *               phone: "+351 21 1234 5678"
 *               products: []
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/shops:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shops
 *     summary: Criar nova loja
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - address
 *             - city
 *           properties:
 *             name:
 *               type: string
 *               example: "Loja Centro"
 *             address:
 *               type: string
 *               example: "Rua Principal, 123"
 *             city:
 *               type: string
 *               example: "Lisboa"
 *             phone:
 *               type: string
 *               example: "+351 21 1234 5678"
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shops
 *     summary: Obter detalhes de uma loja com seus produtos
 *     parameters:
 *       - name: id
 *         description: ID da loja
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Loja encontrada com seus produtos
 *         example:
 *           id: 1
 *           name: "Loja Centro"
 *           address: "Rua Principal, 123"
 *           city: "Lisboa"
 *           phone: "+351 21 1234 5678"
 *           products: []
 *       404:
 *         description: Loja não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shops
 *     summary: Atualizar loja
 *     parameters:
 *       - name: id
 *         description: ID da loja
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             phone:
 *               type: string
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *       404:
 *         description: Loja não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Shops
 *     summary: Eliminar loja
 *     parameters:
 *       - name: id
 *         description: ID da loja
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Loja eliminada com sucesso
 *       404:
 *         description: Loja não encontrada
 *       401:
 *         description: Não autorizado
 */