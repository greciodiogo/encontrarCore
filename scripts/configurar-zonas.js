#!/usr/bin/env node
'use strict'

/**
 * Script para configurar zonas de entrega em Luanda
 * Base: Luanda Sul (Talatona)
 * 
 * Uso: node scripts/configurar-zonas.js
 */

const Database = use('Database')

async function configurarZonas() {
  console.log('🚀 Iniciando configuração de zonas de entrega...\n')
  
  try {
    // 1. Limpar configurações antigas
    console.log('🧹 Limpando configurações antigas...')
    await Database
      .table('addresses')
      .where('is_zone', true)
      .update({
        latitude: null,
        longitude: null,
        radius_km: null,
        is_zone: null
      })
    console.log('✅ Configurações antigas removidas\n')
    
    // 2. Configurar Luanda Sul como base
    console.log('🏠 Configurando Luanda Sul (BASE)...')
    const luandaSulUpdated = await Database
      .table('addresses')
      .whereRaw("LOWER(name) LIKE '%luanda sul%' OR LOWER(name) LIKE '%talatona%'")
      .orWhereRaw("LOWER(address) LIKE '%talatona%' OR LOWER(address) LIKE '%luanda sul%'")
      .update({
        latitude: -8.9167,
        longitude: 13.1833,
        radius_km: 5,
        is_zone: true,
        price: 1000,
        updated_at: new Date()
      })
    
    if (luandaSulUpdated === 0) {
      // Criar se não existir
      await Database.table('addresses').insert({
        name: 'Luanda Sul (Base)',
        address: 'Talatona, Luanda Sul',
        city: 'Luanda',
        state: 'Luanda',
        price: 1000,
        latitude: -8.9167,
        longitude: 13.1833,
        radius_km: 5,
        is_zone: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      console.log('✅ Luanda Sul criada como BASE\n')
    } else {
      console.log(`✅ ${luandaSulUpdated} endereço(s) configurado(s) como BASE\n`)
    }
    
    // 3. Configurar zonas próximas
    console.log('🟢 Configurando zonas próximas (5-10 km)...')
    const zonasProximas = [
      { name: 'kilamba', lat: -8.9500, lon: 13.2000, radius: 6, price: 1600 },
      { name: 'benfica', lat: -8.9000, lon: 13.2500, radius: 6, price: 1700 },
      { name: 'belas', lat: -9.0500, lon: 13.1500, radius: 7, price: 1800 },
      { name: 'samba', lat: -8.8833, lon: 13.2167, radius: 7, price: 1800 },
      { name: 'alvalade', lat: -8.8500, lon: 13.2167, radius: 5, price: 1900 },
      { name: 'morro bento', lat: -8.8667, lon: 13.2333, radius: 5, price: 2000 }
    ]
    
    for (const zona of zonasProximas) {
      const updated = await Database
        .table('addresses')
        .whereRaw(`LOWER(name) LIKE '%${zona.name}%' OR LOWER(address) LIKE '%${zona.name}%'`)
        .whereNull('is_zone')
        .update({
          latitude: zona.lat,
          longitude: zona.lon,
          radius_km: zona.radius,
          is_zone: true,
          price: zona.price,
          updated_at: new Date()
        })
      
      if (updated > 0) {
        console.log(`  ✅ ${zona.name}: ${updated} endereço(s) - ${zona.price} Kz`)
      }
    }
    console.log('')
    
    // 4. Configurar zonas médias
    console.log('🟡 Configurando zonas médias (10-15 km)...')
    const zonasMedias = [
      { name: 'maianga', lat: -8.8167, lon: 13.2500, radius: 5, price: 2000 },
      { name: 'ingombota', lat: -8.8167, lon: 13.2333, radius: 4, price: 2100 },
      { name: 'sambizanga', lat: -8.8500, lon: 13.2500, radius: 6, price: 2100 },
      { name: 'cazenga', lat: -8.8667, lon: 13.2833, radius: 6, price: 2100 },
      { name: 'centro', lat: -8.8383, lon: 13.2344, radius: 5, price: 2200 },
      { name: 'baixa', lat: -8.8383, lon: 13.2344, radius: 5, price: 2200 },
      { name: 'rangel', lat: -8.8333, lon: 13.2667, radius: 5, price: 2200 }
    ]
    
    for (const zona of zonasMedias) {
      const updated = await Database
        .table('addresses')
        .whereRaw(`LOWER(name) LIKE '%${zona.name}%' OR LOWER(address) LIKE '%${zona.name}%'`)
        .whereNull('is_zone')
        .update({
          latitude: zona.lat,
          longitude: zona.lon,
          radius_km: zona.radius,
          is_zone: true,
          price: zona.price,
          updated_at: new Date()
        })
      
      if (updated > 0) {
        console.log(`  ✅ ${zona.name}: ${updated} endereço(s) - ${zona.price} Kz`)
      }
    }
    console.log('')
    
    // 5. Configurar zonas distantes
    console.log('🔴 Configurando zonas distantes (15-25 km)...')
    const zonasDistantes = [
      { name: 'viana', lat: -8.8883, lon: 13.3744, radius: 10, price: 2800 },
      { name: 'cacuaco', lat: -8.7833, lon: 13.3667, radius: 8, price: 3000 }
    ]
    
    for (const zona of zonasDistantes) {
      const updated = await Database
        .table('addresses')
        .whereRaw(`LOWER(name) LIKE '%${zona.name}%' OR LOWER(address) LIKE '%${zona.name}%'`)
        .whereNull('is_zone')
        .update({
          latitude: zona.lat,
          longitude: zona.lon,
          radius_km: zona.radius,
          is_zone: true,
          price: zona.price,
          updated_at: new Date()
        })
      
      if (updated > 0) {
        console.log(`  ✅ ${zona.name}: ${updated} endereço(s) - ${zona.price} Kz`)
      }
    }
    console.log('')
    
    // 6. Verificar configuração
    console.log('📊 ZONAS CONFIGURADAS:\n')
    const zonas = await Database
      .select('name', 'address', 'price', 'latitude', 'longitude', 'radius_km')
      .from('addresses')
      .where('is_zone', true)
      .orderBy('price', 'asc')
    
    console.log('┌─────────────────────┬──────────┬─────────────┬──────────────┬───────────┐')
    console.log('│ Zona                │ Taxa (Kz)│ Latitude    │ Longitude    │ Raio (km) │')
    console.log('├─────────────────────┼──────────┼─────────────┼──────────────┼───────────┤')
    
    zonas.forEach(zona => {
      const nome = (zona.name || '').padEnd(19).substring(0, 19)
      const taxa = String(zona.price || 0).padStart(8)
      const lat = String(zona.latitude || 0).padStart(11)
      const lon = String(zona.longitude || 0).padStart(12)
      const raio = String(zona.radius_km || 0).padStart(9)
      
      console.log(`│ ${nome} │ ${taxa} │ ${lat} │ ${lon} │ ${raio} │`)
    })
    
    console.log('└─────────────────────┴──────────┴─────────────┴──────────────┴───────────┘\n')
    
    // 7. Estatísticas
    const stats = await Database
      .from('addresses')
      .where('is_zone', true)
      .count('* as total')
      .min('price as taxa_minima')
      .max('price as taxa_maxima')
      .avg('price as taxa_media')
      .first()
    
    console.log('📈 ESTATÍSTICAS:')
    console.log(`   Total de zonas: ${stats.total}`)
    console.log(`   Taxa mínima: ${stats.taxa_minima} Kz`)
    console.log(`   Taxa máxima: ${stats.taxa_maxima} Kz`)
    console.log(`   Taxa média: ${Math.round(stats.taxa_media)} Kz\n`)
    
    // 8. Endereços sem configuração
    const semConfiguracao = await Database
      .select('name', 'address')
      .from('addresses')
      .whereNull('is_zone')
      .whereNotNull('name')
      .limit(10)
    
    if (semConfiguracao.length > 0) {
      console.log('⚠️  ENDEREÇOS SEM CONFIGURAÇÃO (primeiros 10):')
      semConfiguracao.forEach(addr => {
        console.log(`   - ${addr.name} (${addr.address || 'sem endereço'})`)
      })
      console.log('')
    }
    
    console.log('✅ Configuração concluída com sucesso!\n')
    console.log('🎯 Próximos passos:')
    console.log('   1. Testar API: POST /api/delivery/calculate-fee')
    console.log('   2. Testar Mobile: Seleção no mapa')
    console.log('   3. Ajustar taxas se necessário\n')
    
  } catch (error) {
    console.error('❌ Erro ao configurar zonas:', error)
    throw error
  }
}

// Executar
configurarZonas()
  .then(() => {
    console.log('🎉 Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })
