
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ProductsService = use('App/Modules/Catalog/Services/ProductsService')
const ShopService = use('App/Modules/Catalog/Services/ShopService')

/**
 * Resourceful controller for interacting with icttrunkouts
 */
class AdminController{
 
  async getProductsByShop ({ request, response, auth  }) {
    const filters = request;
    const UserId = auth.user.id;
    const shop = await new ShopService().findShopByUserId(UserId)
    const shopId = shop.id;
    const data = await new ProductsService().getProductsByShop(filters, shopId);
    return response.ok(data);
  }

  async getShopInfo ({ request, response, auth  }) {
    const filters = request;
    const UserId = auth.user.id;
    const shop = await new ShopService().findShopByUserId(UserId)
    const shopId = shop.id;
    const data = await new ProductsService().getShopInfo(filters, shopId);
    return response.ok(data);
  }

}

module.exports = AdminController
    