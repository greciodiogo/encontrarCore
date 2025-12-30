'use strict'

const Firebase = require('../../config/firebase')

class FirebaseService {
  /**
   * Envia notificação quando um novo pedido é criado
   * Notifica tanto o cliente quanto os parceiros (shops)
   */
  async notifyNewOrder(order, orderItems) {
    try {
      // Buscar informações do cliente e da(s) loja(s)
      const User = use('App/Modules/Authentication/Models/User')
      const Shop = use('App/Modules/Catalog/Models/Shops')

      // Obter dados do cliente
      const customer = await User.find(order.user_id)
      if (!customer) {
        console.log('Customer not found for order:', order.id)
        return
      }

      // Notificação para o cliente
      const customerNotification = {
        title: 'Pedido Confirmado',
        body: `Seu pedido #${order.id} foi recebido e está sendo preparado.`
      }

      const customerData = {
        type: 'new_order',
        orderId: order.id.toString(),
        orderStatus: order.status,
        totalAmount: order.total_amount.toString()
      }

      await this.notifyUser(customer.id, customerNotification, customerData)

      // Notificações para os parceiros (shops)
      const shopIds = [...new Set(orderItems.map(item => item.shop_id))]

      for (const shopId of shopIds) {
        const shop = await Shop.find(shopId)
        if (!shop) continue

        const shopNotification = {
          title: 'Novo Pedido',
          body: `Você recebeu um novo pedido #${order.id}`
        }

        const shopData = {
          type: 'new_order_shop',
          orderId: order.id.toString(),
          customerId: order.user_id.toString(),
          orderStatus: order.status
        }

        await this.notifyShopUsers(shopId, shopNotification, shopData)
      }

      console.log('Order notifications sent successfully')
    } catch (error) {
      console.error('Error sending order notifications:', error.message)
    }
  }

  /**
   * Envia notificação para um usuário específico
   */
  async notifyUser(userId, notification, data = {}) {
    try {
      const DeviceToken = use('App/Models/DeviceToken')
      const tokens = await DeviceToken.where('user_id', userId).fetch()

      if (tokens.size === 0) {
        console.log(`No tokens found for user ${userId}`)
        return
      }

      const tokenList = tokens.rows.map(t => t.token)
      
      if (tokenList.length === 1) {
        await Firebase.sendNotification(tokenList[0], notification, data)
      } else {
        await Firebase.sendMulticast(tokenList, notification, data)
      }
    } catch (error) {
      console.error('Error notifying user:', error.message)
    }
  }

  /**
   * Envia notificação para todos os usuários de uma loja
   */
  async notifyShopUsers(shopId, notification, data = {}) {
    try {
      const Database = use('Database')
      
      // Buscar todos os usuários que trabalham na loja
      const shopUsers = await Database.table('users')
        .whereRaw('roles @> ?', [JSON.stringify([{ id: 'seller', name: 'seller' }])])
        .where('shop_id', shopId)
        .select('id')

      for (const user of shopUsers) {
        await this.notifyUser(user.id, notification, data)
      }
    } catch (error) {
      console.error('Error notifying shop users:', error.message)
    }
  }

  /**
   * Notifica múltiplos usuários
   */
  async notifyUsers(userIds, notification, data = {}) {
    try {
      const DeviceToken = use('App/Models/DeviceToken')
      const tokens = await DeviceToken.whereIn('user_id', userIds).fetch()

      if (tokens.size === 0) {
        console.log('No tokens found for users')
        return
      }

      const tokenList = tokens.rows.map(t => t.token)
      await Firebase.sendMulticast(tokenList, notification, data)
    } catch (error) {
      console.error('Error notifying multiple users:', error.message)
    }
  }

  /**
   * Notifica via tópico (melhor para broadcast)
   */
  async notifyTopic(topic, notification, data = {}) {
    try {
      await Firebase.sendToTopic(topic, notification, data)
    } catch (error) {
      console.error('Error sending topic notification:', error.message)
    }
  }

  /**
   * Inscreve usuário em um tópico
   */
  async subscribeUserToTopic(userId, topic) {
    try {
      const DeviceToken = use('App/Models/DeviceToken')
      const tokens = await DeviceToken.where('user_id', userId).fetch()

      if (tokens.size === 0) {
        console.log(`No tokens found for user ${userId}`)
        return
      }

      const tokenList = tokens.rows.map(t => t.token)
      await Firebase.subscribeToTopic(tokenList, topic)
    } catch (error) {
      console.error('Error subscribing to topic:', error.message)
    }
  }

  /**
   * Remove inscrição de usuário de um tópico
   */
  async unsubscribeUserFromTopic(userId, topic) {
    try {
      const DeviceToken = use('App/Models/DeviceToken')
      const tokens = await DeviceToken.where('user_id', userId).fetch()

      if (tokens.size === 0) {
        console.log(`No tokens found for user ${userId}`)
        return
      }

      const tokenList = tokens.rows.map(t => t.token)
      await Firebase.unsubscribeFromTopic(tokenList, topic)
    } catch (error) {
      console.error('Error unsubscribing from topic:', error.message)
    }
  }

  /**
   * Notifica atualização de status do pedido
   */
  async notifyOrderStatusUpdate(order, newStatus, message) {
    try {
      const User = use('App/Models/User')
      const customer = await User.find(order.user_id)

      if (!customer) return

      const notification = {
        title: 'Atualização de Pedido',
        body: message || `Seu pedido #${order.id} foi atualizado para ${newStatus}`
      }

      const data = {
        type: 'order_status_update',
        orderId: order.id.toString(),
        orderStatus: newStatus
      }

      await this.notifyUser(customer.id, notification, data)
    } catch (error) {
      console.error('Error notifying order status update:', error.message)
    }
  }

  /**
   * Notifica cancellação de pedido
   */
  async notifyOrderCancelled(order, reason = '') {
    try {
      const User = use('App/Models/User')
      const customer = await User.find(order.user_id)

      if (!customer) return

      const notification = {
        title: 'Pedido Cancelado',
        body: `Seu pedido #${order.id} foi cancelado. ${reason}`
      }

      const data = {
        type: 'order_cancelled',
        orderId: order.id.toString(),
        reason: reason
      }

      await this.notifyUser(customer.id, notification, data)
    } catch (error) {
      console.error('Error notifying order cancellation:', error.message)
    }
  }
}

module.exports = FirebaseService
