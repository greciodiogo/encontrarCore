'use strict'

const Database = use('Database')
const ShopOrderRepository = use('App/Modules/Sales/Repositories/ShopOrderRepository')
const ShopOrderItemRepository = use('App/Modules/Sales/Repositories/ShopOrderItemRepository')


class ShopOrderFactory {
  async createFromOrder (order, trx) {
     
    const orderItems = await Database
      .table('order_items')
      .transacting(trx)
      .where('orderId', order.id)

    if (!orderItems.length) {
      throw new Error(`Order ${order.id} sem items`)
    }

    const itemsByShop = {}

    for (const item of orderItems) {
      const shopItem = await Database
        .table('products')
        .where('id', item.productId)
        .first()
        // .transacting(trx)

      if (!shopItem) {
        throw new Error(`Produto ${item.productId} sem loja`)
      }

      const shopId = shopItem.shopId

      itemsByShop[shopId] ||= []
      itemsByShop[shopId].push(item)
    }

    for (const shopId in itemsByShop) {
      const shopItems = itemsByShop[shopId]

      const total = shopItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      )

      const shopOrder = await new ShopOrderRepository().create({
        order_id: order.id,
        shop_id: shopId,
        status: 'PENDING',
        total_amount: total
      })

      for (const item of shopItems) {
        await new ShopOrderItemRepository().create({
          shop_order_id: shopOrder.id,
          order_item_id: item.id
        })
      }
    }
  }
}

module.exports = ShopOrderFactory
