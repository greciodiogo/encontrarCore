'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Supabase Configuration
  |--------------------------------------------------------------------------
  |
  | Configuration for Supabase storage client
  |
  */
  url: Env.get('SUPABASE_URL', ''),
  key: Env.get('SUPABASE_KEY', ''),
  bucket: Env.get('SUPABASE_BUCKET', 'uploads')
}

