/**
 * @swagger
 * /api/categories:
 *   get:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: List all categories with pagination
 *     parameters:
 *       - name: page
 *         description: Page number
 *         in: query
 *         type: integer
 *         example: 1
 *       - name: limit
 *         description: Items per page
 *         in: query
 *         type: integer
 *         example: 10
 *       - name: search
 *         description: Search by category name
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Eletrônicos"
 *                       description:
 *                         type: string
 *                         example: "Produtos eletrônicos em geral"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     per_page:
 *                       type: integer
 *                       example: 10
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     last_page:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E_INVALID_AUTH_TOKEN: JWT token is required to access this endpoint"
 */

/**
/**
 * @swagger
 * /api/categories/buildCategoriesTree:
 *   get:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Get categories in a hierarchical tree structure
 *     responses:
 *       200:
 *         description: Categories tree retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Parent Category"
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 2
 *                             name:
 *                               type: string
 *                               example: "Child Category"
 *                             parent_id:
 *                               type: integer
 *                               example: 1
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E_INVALID_AUTH_TOKEN: JWT token is required to access this endpoint"
 *
 * @swagger
 * /api/categories:
 *   post:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Criar nova categoria
 *     parameters:
 *       - name: name
 *         description: Nome da categoria
 *         in: formData
 *         type: string
 *         required: true
 *       - name: description
 *         description: Descrição da categoria
 *         in: formData
 *         type: string
 *         required: false
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         example:
 *           data:
 *             id: 1
 *             name: "Electronics"
 *             description: "Electronic products"
 *       422:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Obter detalhes de uma categoria
 *     parameters:
 *       - name: id
 *         description: ID da categoria
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         example:
 *           data:
 *             id: 1
 *             name: "Electronics"
 *             description: "Electronic products"
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Atualizar categoria
 *     parameters:
 *       - name: id
 *         description: ID da categoria
 *         in: path
 *         required: true
 *         type: integer
 *       - name: name
 *         description: Nome da categoria
 *         in: formData
 *         type: string
 *         required: false
 *       - name: description
 *         description: Descrição da categoria
 *         in: formData
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         example:
 *           data:
 *             id: 1
 *             name: "Electronics & Gadgets"
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     security:
 *     - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Eliminar categoria
 *     parameters:
 *       - name: id
 *         description: ID da categoria
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Categoria eliminada com sucesso
 *         example:
 *           message: "Categoria eliminada com sucesso"
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
