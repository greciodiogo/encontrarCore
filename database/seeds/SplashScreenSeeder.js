'use strict'

/*
|--------------------------------------------------------------------------
| SplashScreenSeeder
|--------------------------------------------------------------------------
|
| Popula a tabela splash_screens com dados iniciais
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class SplashScreenSeeder {
  async run () {
    const splashScreens = [
      {
        title: 'Bem-vindo ao Encontrar',
        description: 'Descubra os melhores produtos e serviços perto de você',
        image_url: '/uploads/splash_screens/splash1.png',
        order: 1,
        duration: 3000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Compre com Segurança',
        description: 'Pagamentos seguros e entrega rápida',
        image_url: '/uploads/splash_screens/splash2.png',
        order: 2,
        duration: 3000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Ofertas Exclusivas',
        description: 'Aproveite descontos especiais todos os dias',
        image_url: '/uploads/splash_screens/splash3.png',
        order: 3,
        duration: 3000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    await Database.table('splash_screens').insert(splashScreens)
  }
}

module.exports = SplashScreenSeeder
