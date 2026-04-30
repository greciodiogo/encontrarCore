-- ============================================
-- CONFIGURAÇÃO DE ZONAS DE ENTREGA - LUANDA
-- Base: Luanda Sul
-- ============================================

-- ENDEREÇO BASE (LUANDA SUL)
-- Coordenadas: -8.9167, 13.1833 (Talatona/Luanda Sul)
-- Taxa base: 1000 Kz
-- Taxa adicional: 100 Kz/km fora da zona

-- ============================================
-- 1. LIMPAR CONFIGURAÇÕES ANTIGAS
-- ============================================

UPDATE addresses 
SET 
  latitude = NULL,
  longitude = NULL,
  radius_km = NULL,
  is_zone = NULL
WHERE is_zone = true;

-- ============================================
-- 2. CONFIGURAR LUANDA SUL COMO BASE
-- ============================================

-- Luanda Sul / Talatona (BASE - 0 Kz adicional)
UPDATE addresses 
SET 
  latitude = -8.9167, 
  longitude = 13.1833, 
  radius_km = 5,
  is_zone = true,
  price = 1000,  -- Taxa base
  updated_at = NOW()
WHERE LOWER(name) LIKE '%luanda sul%' 
   OR LOWER(name) LIKE '%talatona%'
   OR LOWER(address) LIKE '%talatona%'
   OR LOWER(address) LIKE '%luanda sul%';

-- Se não encontrou, criar registro
INSERT INTO addresses (name, address, city, state, price, latitude, longitude, radius_km, is_zone, created_at, updated_at)
SELECT 
  'Luanda Sul (Base)',
  'Talatona, Luanda Sul',
  'Luanda',
  'Luanda',
  1000,
  -8.9167,
  13.1833,
  5,
  true,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM addresses 
  WHERE is_zone = true 
  AND latitude = -8.9167 
  AND longitude = 13.1833
);

-- ============================================
-- 3. ZONAS PRÓXIMAS (5-10 KM) - Taxa Moderada
-- ============================================

-- Kilamba (6 km da base)
UPDATE addresses 
SET 
  latitude = -8.9500, 
  longitude = 13.2000, 
  radius_km = 6,
  is_zone = true,
  price = 1600,  -- ~600 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%kilamba%' OR LOWER(address) LIKE '%kilamba%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Belas (8 km da base)
UPDATE addresses 
SET 
  latitude = -9.0500, 
  longitude = 13.1500, 
  radius_km = 7,
  is_zone = true,
  price = 1800,  -- ~800 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%belas%' OR LOWER(address) LIKE '%belas%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Benfica (7 km da base)
UPDATE addresses 
SET 
  latitude = -8.9000, 
  longitude = 13.2500, 
  radius_km = 6,
  is_zone = true,
  price = 1700,  -- ~700 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%benfica%' OR LOWER(address) LIKE '%benfica%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- ============================================
-- 4. ZONAS CENTRAIS (10-15 KM) - Taxa Média
-- ============================================

-- Luanda Centro / Baixa (12 km da base)
UPDATE addresses 
SET 
  latitude = -8.8383, 
  longitude = 13.2344, 
  radius_km = 5,
  is_zone = true,
  price = 2200,  -- ~1200 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%centro%' 
   OR LOWER(name) LIKE '%baixa%' 
   OR LOWER(name) LIKE '%luanda' AND LOWER(name) NOT LIKE '%sul%'
   OR LOWER(address) LIKE '%baixa%'
   OR LOWER(address) LIKE '%centro%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Maianga (10 km da base)
UPDATE addresses 
SET 
  latitude = -8.8167, 
  longitude = 13.2500, 
  radius_km = 5,
  is_zone = true,
  price = 2000,  -- ~1000 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%maianga%' OR LOWER(address) LIKE '%maianga%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Ingombota (11 km da base)
UPDATE addresses 
SET 
  latitude = -8.8167, 
  longitude = 13.2333, 
  radius_km = 4,
  is_zone = true,
  price = 2100,  -- ~1100 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%ingombota%' OR LOWER(address) LIKE '%ingombota%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Alvalade (9 km da base)
UPDATE addresses 
SET 
  latitude = -8.8500, 
  longitude = 13.2167, 
  radius_km = 5,
  is_zone = true,
  price = 1900,  -- ~900 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%alvalade%' OR LOWER(address) LIKE '%alvalade%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- ============================================
-- 5. ZONAS PERIFÉRICAS (15-20 KM) - Taxa Alta
-- ============================================

-- Viana (18 km da base)
UPDATE addresses 
SET 
  latitude = -8.8883, 
  longitude = 13.3744, 
  radius_km = 10,
  is_zone = true,
  price = 2800,  -- ~1800 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%viana%' OR LOWER(address) LIKE '%viana%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Cacuaco (20 km da base)
UPDATE addresses 
SET 
  latitude = -8.7833, 
  longitude = 13.3667, 
  radius_km = 8,
  is_zone = true,
  price = 3000,  -- ~2000 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%cacuaco%' OR LOWER(address) LIKE '%cacuaco%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Cazenga (11 km da base)
UPDATE addresses 
SET 
  latitude = -8.8667, 
  longitude = 13.2833, 
  radius_km = 6,
  is_zone = true,
  price = 2100,  -- ~1100 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%cazenga%' OR LOWER(address) LIKE '%cazenga%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Rangel (12 km da base)
UPDATE addresses 
SET 
  latitude = -8.8333, 
  longitude = 13.2667, 
  radius_km = 5,
  is_zone = true,
  price = 2200,  -- ~1200 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%rangel%' OR LOWER(address) LIKE '%rangel%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Sambizanga (11 km da base)
UPDATE addresses 
SET 
  latitude = -8.8500, 
  longitude = 13.2500, 
  radius_km = 6,
  is_zone = true,
  price = 2100,  -- ~1100 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%sambizanga%' OR LOWER(address) LIKE '%sambizanga%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Samba (8 km da base)
UPDATE addresses 
SET 
  latitude = -8.8833, 
  longitude = 13.2167, 
  radius_km = 7,
  is_zone = true,
  price = 1800,  -- ~800 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%samba%' OR LOWER(address) LIKE '%samba%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- Morro Bento (10 km da base)
UPDATE addresses 
SET 
  latitude = -8.8667, 
  longitude = 13.2333, 
  radius_km = 5,
  is_zone = true,
  price = 2000,  -- ~1000 Kz adicional
  updated_at = NOW()
WHERE (LOWER(name) LIKE '%morro bento%' OR LOWER(address) LIKE '%morro bento%')
  AND (latitude IS NULL OR is_zone IS NULL);

-- ============================================
-- 6. VERIFICAR CONFIGURAÇÃO
-- ============================================

SELECT 
  '📍 ZONAS CONFIGURADAS' as info;

SELECT 
  id,
  name,
  address,
  price as taxa_entrega_kz,
  latitude,
  longitude,
  radius_km,
  ROUND(
    6371 * acos(
      cos(radians(-8.9167)) * 
      cos(radians(latitude)) * 
      cos(radians(longitude) - radians(13.1833)) + 
      sin(radians(-8.9167)) * 
      sin(radians(latitude))
    )
  ) as distancia_base_km,
  CASE 
    WHEN latitude = -8.9167 AND longitude = 13.1833 THEN '🏠 BASE'
    WHEN price <= 1500 THEN '🟢 Próximo'
    WHEN price <= 2200 THEN '🟡 Médio'
    ELSE '🔴 Distante'
  END as categoria
FROM addresses
WHERE is_zone = true
ORDER BY 
  CASE 
    WHEN latitude = -8.9167 AND longitude = 13.1833 THEN 0
    ELSE 1
  END,
  price ASC;

-- ============================================
-- 7. ESTATÍSTICAS
-- ============================================

SELECT 
  '📊 ESTATÍSTICAS' as info;

SELECT 
  COUNT(*) as total_zonas,
  MIN(price) as taxa_minima_kz,
  MAX(price) as taxa_maxima_kz,
  ROUND(AVG(price)) as taxa_media_kz,
  COUNT(CASE WHEN price <= 1500 THEN 1 END) as zonas_proximas,
  COUNT(CASE WHEN price > 1500 AND price <= 2200 THEN 1 END) as zonas_medias,
  COUNT(CASE WHEN price > 2200 THEN 1 END) as zonas_distantes
FROM addresses
WHERE is_zone = true;

-- ============================================
-- 8. ENDEREÇOS SEM ZONA CONFIGURADA
-- ============================================

SELECT 
  '⚠️ ENDEREÇOS SEM COORDENADAS' as info;

SELECT 
  id,
  name,
  address,
  city,
  price
FROM addresses
WHERE (latitude IS NULL OR longitude IS NULL OR is_zone IS NULL)
  AND name IS NOT NULL
LIMIT 20;

