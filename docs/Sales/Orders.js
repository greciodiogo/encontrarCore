/**
 * @swagger
 * /api/orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     summary: Listar todas as encomendas
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
 *         description: Pesquisar por número de encomenda ou cliente
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Lista de encomendas recuperada com sucesso
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   order_number:
 *                     type: string
 *                   userId:
 *                     type: integer
 *                   fullName:
 *                     type: string
 *                   contactEmail:
 *                     type: string
 *                   contactPhone:
 *                     type: string
 *                   total_amount:
 *                     type: number
 *                   created:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado
 *
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     summary: Criar nova encomenda
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - items
 *             - delivery
 *             - payment
 *             - fullName
 *             - contactEmail
 *             - contactPhone
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *             delivery:
 *               type: object
 *               properties:
 *                 methodId:
 *                   type: integer
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 postalCode:
 *                   type: string
 *                 country:
 *                   type: string
 *                 addressId:
 *                   type: integer
 *             payment:
 *               type: object
 *               properties:
 *                 methodId:
 *                   type: integer
 *             fullName:
 *               type: string
 *             contactEmail:
 *               type: string
 *             contactPhone:
 *               type: string
 *             message:
 *               type: string
 *     responses:
 *       201:
 *         description: Encomenda criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     summary: Obter detalhes de uma encomenda
 *     parameters:
 *       - name: id
 *         description: ID da encomenda
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Detalhes da encomenda
 *       404:
 *         description: Encomenda não encontrada
 *       401:
 *         description: Não autorizado
 * 
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     summary: Atualizar encomenda
 *     parameters:
 *       - name: id
 *         description: ID da encomenda
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             contactEmail:
 *               type: string
 *             contactPhone:
 *               type: string
 *             message:
 *               type: string
 *     responses:
 *       200:
 *         description: Encomenda atualizada com sucesso
 *       404:
 *         description: Encomenda não encontrada
 *       401:
 *         description: Não autorizado
 *
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     summary: Eliminar encomenda
 *     parameters:
 *       - name: id
 *         description: ID da encomenda
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Encomenda eliminada com sucesso
 *       404:
 *         description: Encomenda não encontrada
 *       401:
 *         description: Não autorizado
 */
