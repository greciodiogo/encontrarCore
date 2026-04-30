'use strict'

/*
|--------------------------------------------------------------------------
| PopularDeliverySettingsSeeder
|--------------------------------------------------------------------------
|
| Popula as configurações padrão do sistema de entrega
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database')

class PopularDeliverySettingsSeeder {
  async run () {
    const settings = [
      {
        key: 'delivery.default_fee',
        value: '1000',
        type: 'number',
        description: 'Taxa de entrega padrão quando não há zonas configuradas (em Kz)'
      },
      {
        key: 'delivery.extra_km_fee',
        value: '100',
        type: 'number',
        description: 'Taxa adicional por km quando fora da zona de cobertura (em Kz por km)'
      },
      {
        key: 'delivery.default_radius_km',
        value: '5',
        type: 'number',
        description: 'Raio padrão de cobertura quando zona não tem raio definido (em km)'
      },
      {
        key: 'delivery.base_location_lat',
        value: '-8.9167',
        type: 'number',
        description: 'Latitude da localização base (Luanda Sul - Talatona)'
      },
      {
        key: 'delivery.base_location_lng',
        value: '13.1833',
        type: 'number',
        description: 'Longitude da localização base (Luanda Sul - Talatona)'
      },
      {
        key: 'delivery.min_order_for_free_delivery',
        value: '0',
        type: 'number',
        description: 'Valor mínimo do pedido para entrega grátis (0 = desabilitado, em Kz)'
      }
    ]

    for (const setting of settings) {
      // Verificar se já existe
      const exists = await Database
        .table('delivery_settings')
        .where('key', setting.key)
        .first()

      if (!exists) {
        await Database
          .table('delivery_settings')
          .insert({
            ...setting,
            created_at: new Date(),
            updated_at: new Date()
          })
        
        console.log(`✅ Configuração criada: ${setting.key} = ${setting.value}`)
      } else {
        console.log(`⏭️  Configuração já existe: ${setting.key}`)
      }
    }

    console.log('\n✅ Configurações de entrega populadas com sucesso!')
  }
}

module.exports = PopularDeliverySettingsSeeder
