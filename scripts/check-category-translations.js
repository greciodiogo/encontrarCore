/**
 * Script para verificar e popular traduções de categorias
 */

'use strict'

const Database = use('Database')

async function checkCategoryTranslations() {
  try {
    console.log('🔍 Verificando traduções de categorias...\n')
    
    // Buscar todas as categorias
    const categories = await Database
      .table('categories')
      .select('id', 'name', 'name_en', 'description', 'description_en')
      .limit(10)
    
    console.log(`📊 Total de categorias (primeiras 10): ${categories.length}\n`)
    
    let withTranslation = 0
    let withoutTranslation = 0
    
    categories.forEach((cat, index) => {
      const hasTranslation = cat.name_en !== null && cat.name_en !== ''
      
      if (hasTranslation) {
        withTranslation++
      } else {
        withoutTranslation++
      }
      
      console.log(`${index + 1}. ${cat.name}`)
      console.log(`   ID: ${cat.id}`)
      console.log(`   name_en: ${cat.name_en || '❌ VAZIO'}`)
      console.log(`   description_en: ${cat.description_en || '❌ VAZIO'}`)
      console.log(`   Status: ${hasTranslation ? '✅ TEM TRADUÇÃO' : '❌ SEM TRADUÇÃO'}`)
      console.log('')
    })
    
    console.log('\n📈 RESUMO:')
    console.log(`✅ Com tradução: ${withTranslation}`)
    console.log(`❌ Sem tradução: ${withoutTranslation}`)
    
    if (withoutTranslation > 0) {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO:')
      console.log('As categorias não têm traduções em inglês!')
      console.log('Você precisa popular os campos name_en e description_en')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.error(error)
  }
  
  process.exit(0)
}

// Executar
checkCategoryTranslations()
