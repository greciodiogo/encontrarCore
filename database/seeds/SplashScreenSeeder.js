'use strict'

/*
|--------------------------------------------------------------------------
| SplashScreenSeeder
|--------------------------------------------------------------------------
|
| Popula a tabela splash_screens com dados iniciais e faz upload das
| imagens para o Supabase Storage na pasta splash/
|
*/

const Database = use('Database')
const fs = require('fs')
const path = require('path')
const Helpers = use('Helpers')
const Env = use('Env')
const sharp = require('sharp')
const { createClient } = require('@supabase/supabase-js')
const Config = use('Config')

class SplashScreenSeeder {
  async run () {
    // Verificar se já existem splash screens
    const existingSplashScreens = await Database.table('splash_screens').count('* as total')
    
    if (existingSplashScreens[0].total > 0) {
      console.log('⚠️  Splash screens já existem. Pulando seeder...')
      return
    }

    console.log('📱 Iniciando upload de splash screens para Supabase...')
    console.log('📁 Pasta de destino: splash/')
    
    // Inicializar Supabase client
    const supabaseConfig = Config.get('supabase')
    const supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.key,
      { auth: { persistSession: false } }
    )
    const bucket = Env.get('SUPABASE_BUCKET', 'uploads')
    
    const assetsPath = Helpers.appRoot('assets/splash')
    
    // Definir imagens e seus dados
    const splashData = [
      {
        fileName: 'splash_5.jpeg',
        title: 'Bem-vindo ao Encontrar',
        description: 'Descubra os melhores produtos e serviços perto de você. Compre com segurança e receba em casa.',
        order: 1,
        duration: 3000
      },
      {
        fileName: 'splash_6.jpeg',
        title: 'Ofertas Exclusivas',
        description: 'Aproveite descontos especiais e promoções todos os dias. Economize nas suas compras favoritas.',
        order: 2,
        duration: 3000
      },
      {
        fileName: 'splash_7.jpeg',
        title: 'Entrega Rápida e Segura',
        description: 'Receba seus produtos com rapidez e segurança. Acompanhe seu pedido em tempo real.',
        order: 3,
        duration: 3000
      }
    ]

    const splashScreens = []

    // Upload de cada imagem para o Supabase
    for (const splash of splashData) {
      try {
        const imagePath = path.join(assetsPath, splash.fileName)
        
        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️  Imagem não encontrada: ${splash.fileName}`)
          continue
        }

        console.log(`📤 Fazendo upload: ${splash.fileName}...`)
        
        // Ler arquivo
        const fileBuffer = fs.readFileSync(imagePath)
        
        // Converter para JPEG de alta qualidade
        const jpegBuffer = await sharp(fileBuffer)
          .flatten({ background: '#ffffff' })
          .jpeg({ quality: 100, mozjpeg: true })
          .rotate() // auto-rotate based on EXIF
          .toBuffer()
        
        // Definir path no Supabase: splash/timestamp-nome.jpg
        const safeName = splash.fileName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-')
        const supabasePath = `splash/${Date.now()}-${safeName}.jpg`
        
        // Upload para Supabase
        const { error } = await supabase.storage
          .from(bucket)
          .upload(supabasePath, jpegBuffer, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          })
        
        if (error) {
          console.error(`❌ Erro no upload: ${error.message}`)
          continue
        }
        
        console.log(`✅ Upload concluído: ${supabasePath}`)
        
        // Adicionar ao array de splash screens
        splashScreens.push({
          title: splash.title,
          description: splash.description,
          image_url: supabasePath, // Salvar path completo: splash/...
          order: splash.order,
          duration: splash.duration,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        })
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${splash.fileName}:`, error.message)
      }
    }

    if (splashScreens.length === 0) {
      console.log('❌ Nenhuma imagem foi processada com sucesso')
      return
    }

    console.log('💾 Inserindo splash screens no banco de dados...')
    await Database.table('splash_screens').insert(splashScreens)
    
    console.log('✅ Splash screens inseridos com sucesso!')
    console.log(`📊 Total: ${splashScreens.length} splash screens`)
    console.log(`🌐 Bucket Supabase: ${bucket}`)
    console.log(`📁 Pasta: splash/`)
    console.log(`📍 As imagens estão armazenadas no Supabase Storage`)
  }
}

module.exports = SplashScreenSeeder
