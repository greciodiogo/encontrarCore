#!/usr/bin/env node
'use strict'

/**
 * Script para configurar coordenadas GPS nos endereços existentes
 * Usa coordenadas conhecidas de Luanda
 * 
 * Uso: node scripts/configurar-zonas-existentes.js
 */

// Configuração do banco de dados
const { Client } = require('pg')

const client = new Client({
  host: 'caboose.proxy.rlwy.net',
  port: 17780,
  user: 'postgres',
  password: 'thBxChNccOkKtJjjTFzStchXZRDXbSjI',
  database: 'railway'
})

// Coordenadas conhecidas de Luanda (baseado em pesquisa)
const COORDENADAS_LUANDA = {
  // Zonas Centrais
  'Alvalade': { lat: -8.8500, lon: 13.2167, radius: 5 },
  'Ingombota': { lat: -8.8167, lon: 13.2333, radius: 4 },
  'Maianga': { lat: -8.8167, lon: 13.2500, radius: 5 },
  'Rangel': { lat: -8.8333, lon: 13.2667, radius: 5 },
  'Sambizanga': { lat: -8.8500, lon: 13.2500, radius: 6 },
  'Samba': { lat: -8.8833, lon: 13.2167, radius: 7 },
  
  // Zonas Sul
  'Luanda Sul': { lat: -8.9167, lon: 13.1833, radius: 5 },
  'Talatona': { lat: -8.9167, lon: 13.1833, radius: 5 },
  'Kilamba': { lat: -8.9500, lon: 13.2000, radius: 6 },
  'Kilamba Kiaxi': { lat: -8.9500, lon: 13.2000, radius: 6 },
  'Belas': { lat: -9.0500, lon: 13.1500, radius: 7 },
  'Benfica': { lat: -8.9000, lon: 13.2500, radius: 6 },
  
  // Zonas Periféricas
  'Viana': { lat: -8.8883, lon: 13.3744, radius: 10 },
  'Cacuaco': { lat: -8.7833, lon: 13.3667, radius: 8 },
  'Cazenga': { lat: -8.8667, lon: 13.2833, radius: 6 },
  
  // Outras Zonas
  'Morro Bento': { lat: -8.8667, lon: 13.2333, radius: 5 },
  'Mutamba': { lat: -8.8100, lon: 13.2350, radius: 3 },
  'Maculusso': { lat: -8.8200, lon: 13.2200, radius: 4 },
  'Ilha de Luanda': { lat: -8.7833, lon: 13.2167, radius: 8 },
  'Chicala': { lat: -8.8300, lon: 13.2400, radius: 4 },
  
  // Municípios
  'Icolo e Bengo': { lat: -9.1667, lon: 13.5000, radius: 15 },
  
  // Bairros Específicos
  'Golf 1': { lat: -8.9200, lon: 13.1900, radius: 3 },
  'Golf 2': { lat: -8.9250, lon: 13.1950, radius: 3 },
  'Camama': { lat: -8.9000, lon: 13.1500, radius: 6 },
  'Camama 1': { lat: -8.9000, lon: 13.1500, radius: 6 },
  'Camama 2': { lat: -8.9050, lon: 13.1550, radius: 6 },
  'Futungo': { lat: -8.9300, lon: 13.1700, radius: 5 },
  'Lar do Patriota': { lat: -8.8900, lon: 13.2100, radius: 4 },
  'Cidadela': { lat: -8.8400, lon: 13.2300, radius: 4 },
  'Prenda': { lat: -8.8600, lon: 13.2700, radius: 5 },
  'Palanca': { lat: -8.8700, lon: 13.2900, radius: 5 },
  'Zango': { lat: -8.9800, lon: 13.2500, radius: 8 },
  'Zango 0': { lat: -8.9700, lon: 13.2400, radius: 7 },
  'Zango 1': { lat: -8.9750, lon: 13.2450, radius: 7 },
  'Zango 2': { lat: -8.9800, lon: 13.2500, radius: 7 },
  'Zango 3': { lat: -8.9850, lon: 13.2550, radius: 7 },
  'Zango 4': { lat: -8.9900, lon: 13.2600, radius: 7 },
  'Zango 5000': { lat: -8.9950, lon: 13.2650, radius: 8 },
  'Sequele': { lat: -8.8800, lon: 13.2400, radius: 5 },
  'Miramar': { lat: -8.8150, lon: 13.2250, radius: 3 },
  'Rocha Pinto': { lat: -8.8500, lon: 13.2400, radius: 4 },
  'São Paulo': { lat: -8.8350, lon: 13.2450, radius: 4 },
  'Nelito Soares': { lat: -8.8450, lon: 13.2350, radius: 4 },
  'Boa Vista': { lat: -8.8550, lon: 13.2250, radius: 4 },
  'Boa-Vista': { lat: -8.8550, lon: 13.2250, radius: 4 },
  'Bairro Azul': { lat: -8.8600, lon: 13.2200, radius: 4 },
  'Bairro Operário': { lat: -8.8650, lon: 13.2150, radius: 4 },
  'Calemba': { lat: -8.9100, lon: 13.2800, radius: 6 },
  'Calemba 2': { lat: -8.9150, lon: 13.2850, radius: 6 },
  'Catambor': { lat: -8.8750, lon: 13.2650, radius: 5 },
  'Cassenda': { lat: -8.8800, lon: 13.2750, radius: 5 },
  'Cassenda 1': { lat: -8.8800, lon: 13.2750, radius: 5 },
  'Cassenda 2': { lat: -8.8850, lon: 13.2800, radius: 5 },
  'Hoji ya Henda': { lat: -8.8900, lon: 13.2900, radius: 6 },
  'Ramiros': { lat: -8.8400, lon: 13.2600, radius: 4 },
  'Estalagem': { lat: -8.8300, lon: 13.2700, radius: 4 },
  'Filda': { lat: -8.8200, lon: 13.2800, radius: 4 },
  'Fidel': { lat: -8.8200, lon: 13.2800, radius: 4 },
  'Gamek': { lat: -8.8950, lon: 13.2350, radius: 5 },
  'Grafanil Bar': { lat: -8.8850, lon: 13.2450, radius: 4 },
  'Cuca': { lat: -8.8750, lon: 13.2550, radius: 4 },
  'Dangereux': { lat: -8.8650, lon: 13.2650, radius: 4 },
  'Embondeiro': { lat: -8.8550, lon: 13.2750, radius: 4 },
  'Corimba': { lat: -8.8450, lon: 13.2850, radius: 4 },
  'Mulenvos': { lat: -8.8350, lon: 13.2950, radius: 4 },
  'Mundo Verde': { lat: -8.9050, lon: 13.1950, radius: 4 },
  'Mabubas': { lat: -8.9100, lon: 13.2000, radius: 4 },
  'Marçal': { lat: -8.8250, lon: 13.2550, radius: 4 },
  'Nova Marginal': { lat: -8.8050, lon: 13.2300, radius: 5 },
  'Nova Vida': { lat: -8.8700, lon: 13.2300, radius: 4 },
  'Patriota': { lat: -8.8900, lon: 13.2100, radius: 4 },
  'Palhota': { lat: -8.8800, lon: 13.2200, radius: 4 },
  'Ponta Partida': { lat: -8.7900, lon: 13.2200, radius: 5 },
  'Precol': { lat: -8.8600, lon: 13.2500, radius: 4 },
  'Rotunda do C...': { lat: -8.9000, lon: 13.1800, radius: 3 },
  'Tala Hady': { lat: -8.9200, lon: 13.1900, radius: 4 },
  'Terra Nova': { lat: -8.8950, lon: 13.2250, radius: 4 },
  'Vila Alice': { lat: -8.8850, lon: 13.2350, radius: 4 },
  'Vila de Viana': { lat: -8.8883, lon: 13.3744, radius: 8 },
  'Cidadela Alta': { lat: -8.8420, lon: 13.2320, radius: 3 },
  'Jardim do Éden': { lat: -8.9050, lon: 13.1850, radius: 4 },
  'Largo da Maianga': { lat: -8.8180, lon: 13.2520, radius: 3 },
  'KK 5000': { lat: -8.9950, lon: 13.2650, radius: 8 },
  'Axe Branca': { lat: -8.8300, lon: 13.2500, radius: 4 },
  'Bairro Operário': { lat: -8.8650, lon: 13.2150, radius: 4 },
  'Boa-Vista': { lat: -8.8550, lon: 13.2250, radius: 4 },
  'Bita': { lat: -8.8700, lon: 13.2600, radius: 4 },
  'Catambor': { lat: -8.8750, lon: 13.2650, radius: 5 },
  'Catumbela': { lat: -8.8800, lon: 13.2700, radius: 5 },
  'Embondeiro': { lat: -8.8550, lon: 13.2750, radius: 4 },
  'Estalagem': { lat: -8.8300, lon: 13.2700, radius: 4 },
  'Filda': { lat: -8.8200, lon: 13.2800, radius: 4 },
  'Fidel': { lat: -8.8200, lon: 13.2800, radius: 4 },
  'Futungo': { lat: -8.9300, lon: 13.1700, radius: 5 },
  'Gamek': { lat: -8.8950, lon: 13.2350, radius: 5 },
  'Grafanil Bar': { lat: -8.8850, lon: 13.2450, radius: 4 },
  'Hoji ya Henda': { lat: -8.8900, lon: 13.2900, radius: 6 },
  'Ilha de Luanda': { lat: -8.7833, lon: 13.2167, radius: 8 },
  'Jardim do Éden': { lat: -8.9050, lon: 13.1850, radius: 4 },
  'KK 5000': { lat: -8.9950, lon: 13.2650, radius: 8 },
  'Largo da Maianga': { lat: -8.8180, lon: 13.2520, radius: 3 },
  'Luanda Sul': { lat: -8.9167, lon: 13.1833, radius: 5 },
  'Maculusso': { lat: -8.8200, lon: 13.2200, radius: 4 },
  'Maianga': { lat: -8.8167, lon: 13.2500, radius: 5 },
  'Marçal': { lat: -8.8250, lon: 13.2550, radius: 4 },
  'Miramar': { lat: -8.8150, lon: 13.2250, radius: 3 },
  'Morro Bento': { lat: -8.8667, lon: 13.2333, radius: 5 },
  'Mulenvos': { lat: -8.8350, lon: 13.2950, radius: 4 },
  'Mundo Verde': { lat: -8.9050, lon: 13.1950, radius: 4 },
  'Mutamba': { lat: -8.8100, lon: 13.2350, radius: 3 },
  'Nelito Soares': { lat: -8.8450, lon: 13.2350, radius: 4 },
  'Nova Marginal': { lat: -8.8050, lon: 13.2300, radius: 5 },
  'Nova Vida': { lat: -8.8700, lon: 13.2300, radius: 4 },
  'Palanca': { lat: -8.8700, lon: 13.2900, radius: 5 },
  'Palhota': { lat: -8.8800, lon: 13.2200, radius: 4 },
  'Patriota': { lat: -8.8900, lon: 13.2100, radius: 4 },
  'Ponta Partida': { lat: -8.7900, lon: 13.2200, radius: 5 },
  'Precol': { lat: -8.8600, lon: 13.2500, radius: 4 },
  'Prenda': { lat: -8.8600, lon: 13.2700, radius: 5 },
  'Ramiros': { lat: -8.8400, lon: 13.2600, radius: 4 },
  'Rangel': { lat: -8.8333, lon: 13.2667, radius: 5 },
  'Rocha Pinto': { lat: -8.8500, lon: 13.2400, radius: 4 },
  'Rotunda do C...': { lat: -8.9000, lon: 13.1800, radius: 3 },
  'Samba': { lat: -8.8833, lon: 13.2167, radius: 7 },
  'Sambizanga': { lat: -8.8500, lon: 13.2500, radius: 6 },
  'São Paulo': { lat: -8.8350, lon: 13.2450, radius: 4 },
  'Sequele': { lat: -8.8800, lon: 13.2400, radius: 5 },
  'Tala Hady': { lat: -8.9200, lon: 13.1900, radius: 4 },
  'Talatona': { lat: -8.9167, lon: 13.1833, radius: 5 },
  'Terra Nova': { lat: -8.8950, lon: 13.2250, radius: 4 },
  'Viana': { lat: -8.8883, lon: 13.3744, radius: 10 },
  'Vila Alice': { lat: -8.8850, lon: 13.2350, radius: 4 },
  'Vila de Viana': { lat: -8.8883, lon: 13.3744, radius: 8 },
  'Zango': { lat: -8.9800, lon: 13.2500, radius: 8 },
  'Zango 0': { lat: -8.9700, lon: 13.2400, radius: 7 },
  'Zango 1': { lat: -8.9750, lon: 13.2450, radius: 7 },
  'Zango 2': { lat: -8.9800, lon: 13.2500, radius: 7 },
  'Zango 3': { lat: -8.9850, lon: 13.2550, radius: 7 },
  'Zango 4': { lat: -8.9900, lon: 13.2600, radius: 7 },
  'Zango 5000': { lat: -8.9950, lon: 13.2650, radius: 8 }
}

async function configurarZonasExistentes() {
  console.log('🚀 Configurando coordenadas GPS nos endereços existentes...\n')
  
  try {
    await client.connect()
    console.log('✅ Conectado ao banco de dados\n')
    
    // 1. Buscar todos os endereços
    console.log('📍 Buscando endereços da base de dados...')
    const result = await client.query(`
      SELECT id, name, price, latitude, longitude
      FROM addresses
      WHERE name IS NOT NULL
      AND price IS NOT NULL
      ORDER BY name
    `)
    
    const addresses = result.rows
    console.log(`✅ ${addresses.length} endereços encontrados\n`)
    
    let configurados = 0
    let naoEncontrados = []
    
    // 2. Configurar coordenadas
    console.log('🗺️  Configurando coordenadas...\n')
    
    for (const address of addresses) {
      const nome = address.name.trim()
      
      // Buscar coordenadas exatas ou aproximadas
      let coords = COORDENADAS_LUANDA[nome]
      
      // Se não encontrou exato, tentar busca parcial
      if (!coords) {
        const nomeKeys = Object.keys(COORDENADAS_LUANDA)
        const found = nomeKeys.find(key => 
          nome.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(nome.toLowerCase())
        )
        
        if (found) {
          coords = COORDENADAS_LUANDA[found]
          console.log(`  🔍 ${nome} → ${found}`)
        }
      }
      
      if (coords) {
        await client.query(`
          UPDATE addresses
          SET 
            latitude = $1,
            longitude = $2,
            radius_km = $3,
            is_zone = true
          WHERE id = $4
        `, [coords.lat, coords.lon, coords.radius, address.id])
        
        configurados++
        console.log(`  ✅ ${nome}: ${coords.lat}, ${coords.lon} (${address.price} Kz)`)
      } else {
        naoEncontrados.push(nome)
      }
    }
    
    console.log(`\n📊 RESUMO:`)
    console.log(`   ✅ Configurados: ${configurados}`)
    console.log(`   ⚠️  Não encontrados: ${naoEncontrados.length}\n`)
    
    if (naoEncontrados.length > 0) {
      console.log('⚠️  ENDEREÇOS SEM COORDENADAS:')
      naoEncontrados.slice(0, 20).forEach(nome => {
        console.log(`   - ${nome}`)
      })
      if (naoEncontrados.length > 20) {
        console.log(`   ... e mais ${naoEncontrados.length - 20} endereços`)
      }
      console.log('')
    }
    
    // 3. Mostrar zonas configuradas
    const zonasResult = await client.query(`
      SELECT name, price, latitude, longitude, radius_km
      FROM addresses
      WHERE is_zone = true
      ORDER BY price ASC
      LIMIT 20
    `)
    
    const zonas = zonasResult.rows
    
    console.log('📍 ZONAS CONFIGURADAS (primeiras 20):\n')
    console.log('┌─────────────────────────┬──────────┬─────────────┬──────────────┬───────────┐')
    console.log('│ Zona                    │ Taxa (Kz)│ Latitude    │ Longitude    │ Raio (km) │')
    console.log('├─────────────────────────┼──────────┼─────────────┼──────────────┼───────────┤')
    
    zonas.forEach(zona => {
      const nome = (zona.name || '').padEnd(23).substring(0, 23)
      const taxa = String(zona.price || 0).padStart(8)
      const lat = String(zona.latitude || 0).padStart(11)
      const lon = String(zona.longitude || 0).padStart(12)
      const raio = String(zona.radius_km || 0).padStart(9)
      
      console.log(`│ ${nome} │ ${taxa} │ ${lat} │ ${lon} │ ${raio} │`)
    })
    
    console.log('└─────────────────────────┴──────────┴─────────────┴──────────────┴───────────┘\n')
    
    // 4. Estatísticas
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        MIN(price) as taxa_minima,
        MAX(price) as taxa_maxima,
        ROUND(AVG(price)) as taxa_media
      FROM addresses
      WHERE is_zone = true
    `)
    
    const stats = statsResult.rows[0]
    
    console.log('📈 ESTATÍSTICAS:')
    console.log(`   Total de zonas: ${stats.total}`)
    console.log(`   Taxa mínima: ${stats.taxa_minima} Kz`)
    console.log(`   Taxa máxima: ${stats.taxa_maxima} Kz`)
    console.log(`   Taxa média: ${stats.taxa_media} Kz\n`)
    
    console.log('✅ Configuração concluída!\n')
    console.log('🎯 Próximos passos:')
    console.log('   1. Testar API: POST /api/delivery/calculate-fee')
    console.log('   2. Testar Mobile: Seleção no mapa')
    console.log('   3. Adicionar coordenadas dos endereços não encontrados\n')
    
  } catch (error) {
    console.error('❌ Erro ao configurar zonas:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Executar
configurarZonasExistentes()
  .then(() => {
    console.log('🎉 Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })
