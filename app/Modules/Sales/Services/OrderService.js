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

    async findAllOrderByClient(filters, UserEmail) {
      const search = filters.input("search");
      const options = {
        page: filters.input("page") || 1,
        perPage: filters.input("perPage") || 10,
        orderBy: filters.input("orderBy") || "orders.id",
        typeOrderBy: filters.input("typeOrderBy") || "DESC",
        status: filters.input("status") || "",
        searchBy: ["name", "description"],
        isPaginate: true
      };
  
      // Buscar pedidos com joins
      let ordersQuery = Database
        .select(
          'orders.id',
          'orders.order_number',
          'orders.status',
          'orders.created',
          'orders.fullName as client',
          'orders.contactPhone',
          'orders.contactEmail',
          'payment_methods.name as payment_method',
          'order_deliveries.address as delivery_address',
          'order_deliveries.price as delivery_tax'
        )
        .from('orders')
        .innerJoin('order_payments', 'order_payments.id', 'orders.paymentId')
        .innerJoin('payment_methods', 'payment_methods.id', 'order_payments.methodId')
        .innerJoin('order_deliveries', 'order_deliveries.id', 'orders.deliveryId')
        .where('contactEmail', UserEmail)
        .where(function () {
          if (options.status) {
            if (options.status == 'LOADING') {
              this.where('orders.status', 'open');
            } else if (options.status == 'CONFIRMED') {
              this.where('orders.status', 'delivered').orWhere('orders.status', 'confirmed');
            } else {
              this.where('orders.status', 'pending');
            }
          }
        })
        .orderBy(options.orderBy, options.typeOrderBy);

      // Paginar
      const orders = await ordersQuery
        .paginate(options.page, options.perPage || 10);

      // Para cada pedido, buscar os itens com produtos e fotos
      const ordersWithItems = await Promise.all(
        orders.data.map(async (order) => {
          const items = await Database
            .select(
              'order_items.id',
              'order_items.quantity',
              'order_items.price',
              'products.id as product_id',
              'products.name as product_name',
              'products.description as product_description'
            )
            .from('order_items')
            .innerJoin('products', 'products.id', 'order_items.productId')
            .where('order_items.orderId', order.id);

          // Para cada item, buscar a primeira foto do produto
          const itemsWithPhotos = await Promise.all(
            items.map(async (item) => {
              const photo = await Database
                .select('id', 'path')
                .from('product_photos')
                .where('productId', item.product_id)
                .first();

              return {
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                product: {
                  id: item.product_id,
                  name: item.product_name,
                  description: item.product_description,
                  photos: photo ? [{ id: photo.id, path: photo.path }] : []
                }
              };
            })
          );

          const total = itemsWithPhotos.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
          }, 0);

          return {
            ...order,
            items: itemsWithPhotos,
            total_items: itemsWithPhotos.length,
            total: total
          };
        })
      );

      return {
        ...orders,
        data: ordersWithItems
      };
    }
    /**
     * Criar uma nova ordem
     * @param {Object} orderData - Dados da ordem (items, delivery, payment, etc)
     * @param {number} userId - ID do utilizador (opcional)
     * @returns {Object} Ordem criada
     */
    async createdOrders(orderData, userId = null) {
       const order = await new CreateOrderUseCase().execute(orderData, userId);
       
       // Enviar notificações em background (não aguardar)
       if (order && order.id) {
         const orderItems = orderData.items || []
         // Dispara as notificações sem bloquear a resposta
         const firebaseService = new FirebaseService()
         firebaseService.notifyNewOrder(order, orderItems).catch(error => {
           console.error('Error sending notifications for new order:', error.message)
         })
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
    