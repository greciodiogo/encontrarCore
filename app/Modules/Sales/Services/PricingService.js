const ProductRepository = use('App/Modules/Catalog/Repositories/ProductsRepository')

class PricingService {
  static async calculate (items, delivery) {
    let total = 0
    const pricedItems = []
    const invalidProducts = []

    for (const item of items) {
      const product = await new ProductRepository().findById(item.product_id).first();

      if (!product) {
        invalidProducts.push({
          id: item.product_id,
          reason: 'not_found'
        });
        continue;
      }

      if (!product.visible) {
        invalidProducts.push({
          id: product.id,
          name: product.name,
          reason: 'not_available'
        });
        continue;
      }

      const price = Number(product.price)
      const subtotal = price * item.quantity

      total += subtotal

      pricedItems.push({
        ...item,
        price
      })
    }

    // Se houver produtos inválidos, lançar erro amigável
    if (invalidProducts.length > 0) {
      const notAvailable = invalidProducts.filter(p => p.reason === 'not_available');
      const notFound = invalidProducts.filter(p => p.reason === 'not_found');
      
      let errorMessage = '';
      
      if (notAvailable.length > 0) {
        const productNames = notAvailable.map(p => p.name).join(', ');
        errorMessage = `Alguns produtos no seu carrinho não estão mais disponíveis: ${productNames}. Por favor, remova-os do carrinho.`;
      }
      
      if (notFound.length > 0) {
        if (errorMessage) errorMessage += ' ';
        errorMessage += `Alguns produtos não foram encontrados.`;
      }
      
      throw new Error(errorMessage);
    }

    if (delivery?.price) {
      total += Number(delivery.price)
    }

    return { total, items: pricedItems }
  }
}

module.exports = PricingService
