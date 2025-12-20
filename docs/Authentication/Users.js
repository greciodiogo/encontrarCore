/**
 * @swagger
 * /api/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Listar todos os utilizadores
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
 *         description: Pesquisar por nome ou email
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Lista de utilizadores recuperada com sucesso
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
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Criar novo utilizador
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *             - firstName
 *             - lastName
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               format: password
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Obter detalhes de um utilizador
 *     parameters:
 *       - name: id
 *         description: ID do utilizador
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Detalhes do utilizador
 *       404:
 *         description: Utilizador não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Atualizar utilizador
 *     parameters:
 *       - name: id
 *         description: ID do utilizador
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *     responses:
 *       200:
 *         description: Utilizador atualizado com sucesso
 *       404:
 *         description: Utilizador não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     summary: Eliminar utilizador
 *     parameters:
 *       - name: id
 *         description: ID do utilizador
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Utilizador eliminado com sucesso
 *       404:
 *         description: Utilizador não encontrado
 *       401:
 *         description: Não autorizado
 */
