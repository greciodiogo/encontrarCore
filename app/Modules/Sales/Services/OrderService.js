'use strict'

const Database = use("Database")
const OrderRepository = use("App/Modules/Sales/Repositories/OrderRepository")

const CreateOrderUseCase = use('App/Modules/Sales/Services/CreateOrder/CreateOrderUseCase')
const FirebaseService = use('App/Services/FirebaseService')

    class OrderService{
        
    constructor(){}

    async findAllOrders(filters) {
      const search = filters.input("search");
      const options = {
        page: filters.input("page") || 1,
        perPage: filters.input("perPage") || 10,
        orderBy: filters.input("orderBy") || "id",
        typeOrderBy: filters.input("typeOrderBy") || "DESC",
        searchBy: ["name", "description"],
        isPaginate: true
      };
  
      let query = new OrderRepository()
        .findAll(search, options) 
        .where(function () {})//.where('is_deleted', 0)
      return query.paginate(options.page, options.perPage || 10);
    }

    async findAllOrderByClient(filters, UserId) {
      const selectColumn = `orders.order_number as id, orders.status, orders.created, orders."fullName" as client,` + 
      `orders."contactPhone", orders."contactEmail", payment_methods.name as payment_method, ` + 
      `order_deliveries.address as deliveryId, order_deliveries.price as delivery_tax `;
      const search = filters.input("search");
      const options = {
        page: filters.input("page") || 1,
        perPage: filters.input("perPage") || 10,
        orderBy: filters.input("orderBy") || "orders.id",
        typeOrderBy: filters.input("typeOrderBy") || "DESC",
        searchBy: ["name", "description"],
        isPaginate: true
      };
  
      let query = new OrderRepository()
        .findAll(search, options, selectColumn) 
        .innerJoin('shop_orders', 'shop_orders.order_id', 'orders.id')
        .innerJoin('order_payments', 'order_payments.id', 'orders.paymentId')
        .innerJoin('payment_methods', 'payment_methods.id', 'order_payments.methodId')
        .innerJoin('order_deliveries', 'order_deliveries.id', 'orders.deliveryId')
        .where(function () {}).where('userId', UserId)
      return query.paginate(options.page, options.perPage || 10);
    }
    /**
     * Criar uma nova ordem
     * @param {Object} orderData - Dados da ordem (items, delivery, payment, etc)
     * @param {number} userId - ID do utilizador (opcional)
     * @returns {Object} Ordem criada
     */
    async createdOrders(orderData, userId = null) {
       const order = await new CreateOrderUseCase().execute(orderData, userId);
       
       // Enviar notificações após criar o pedido
       if (order && order.id) {
         try {
           const firebaseService = new FirebaseService()
           const orderItems = orderData.items || []
           await firebaseService.notifyNewOrder(order, orderItems)
         } catch (error) {
           console.error('Error sending notifications for new order:', error.message)
           // Não falhar a criação do pedido se houver erro nas notificações
         }
       }
       
       return order;
    }
   
    /**
     *
     * @param {*} Id
     * @returns
     */
    async findOrderById(Id) {
      return await new OrderRepository().findById(Id) 
        //.where('is_deleted', 0)
        .first();
    }

    /**
     *
     * @param {*} Payload
     * @param {*} Id
     * @returns
     */
    async updatedOrder(Id, ModelPayload) {
      return await new OrderRepository().update(Id, ModelPayload);
    } 
  
    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de forma temporariamente."
     * @param {*} Id 
     * @returns 
     */
    async deleteTemporarilyOrder(Id) {
      return await new OrderRepository().delete(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Elimina os dados de definitivamente."
     * @param {*} Id 
     * @returns 
    */
    async deleteDefinitiveOrder(Id) {
      return await new OrderRepository().deleteDefinitive(Id); 
    }

    /**
     * @author "caniggiamoreira@gmail.com"
     * @deprecated "Listar Lixeira -  registos eliminados temporariamente."
     * @param {*} Payload 
     * @returns 
     */ 
    async findAllOrdersTrash(filters) {
        const options = {
        ...new OrderRepository().setOptions(filters),
        typeOrderBy: "DESC",
        };
        let query = new OrderRepository()
        .findTrash(options.search, options) 
        .where(function () {})//.where('is_deleted', 1)
        return query.paginate(options.page, options.perPage || 10);
    }
    
    }
    module.exports = OrderService
    