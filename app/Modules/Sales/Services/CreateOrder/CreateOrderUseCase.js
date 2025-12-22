const Database = use('Database')
const OrderFactory = use('App/Modules/Sales/Services/CreateOrder/OrderFactory')
const ShopOrderFactory = use('App/Modules/Sales/Services/CreateOrder/ShopOrderFactory')
const NotCreatedException = use("App/Exceptions/NotCreatedException");

class CreateOrderUseCase {
  async execute (orderData, userId = null) {
    const trx = await Database.beginTransaction()
    
    try {
      const order = await new OrderFactory().create(orderData, userId, trx)
      if(!order) throw new NotCreatedException("Pedido Não foi criado");

      await new ShopOrderFactory().createFromOrder(order, trx)
      
      await trx.commit()
      return order
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}

module.exports = CreateOrderUseCase
