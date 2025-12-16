'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const crypto = use('crypto')

Factory.blueprint('App/Modules/Security/Users/Models/User', async (faker, i, data) => {
  return {
    email: data.email || faker.email(),
    username: data.username || faker.username(),
    name: data.name || `${faker.name()}`,
    password: 'Unig4#2021'
  }
})

Factory.blueprint('App/Models/RoleUser', (faker, i, data) => {
  return {
    role_id: data.role_id,
    user_id: data.user_id
  }
})

Factory.blueprint('App/Models/Role', (faker, i, data) => {
  return {
    slug: data.slug || faker.username(),
    name: data.name || faker.name(),
    description: faker.sentence()
  }
})

Factory.blueprint('App/Models/Permission', (faker, i, data) => {
  return {
    slug: data.slug || faker.username(),
    name: data.name || faker.name(),
    description: faker.sentence(),
  }
})

Factory.blueprint('App/Models/Token', async (faker, i, data) => {
  return {
    user_id: data.user_id,
    type: 'recover_password',
    token: await crypto.randomBytes(32).toString('hex')
  }
})
