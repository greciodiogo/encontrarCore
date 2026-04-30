-- Script para popular zonas de entrega de Luanda com coordenadas
-- Execute este script após a migration 1770800000000_add_coordinates_to_addresses_schema

-- ============================================
-- ZONAS PRINCIPAIS DE LUANDA
-- ============================================

-- Luanda Centro (Baixa de Luanda)
UPDATE addresses 
SET 
  latitude = -8.8383, 
  longitude = 13.2344, 
  radius_km = 5, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Luanda%' OR name LIKE '%Centro%' OR name LIKE '%Baixa%'
LIMIT 1;

-- Viana
UPDATE addresses 
SET 
  latitude = -8.8883, 
  longitude = 13.3744, 
  radius_km = 10, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Viana%'
LIMIT 1;

-- Talatona
UPDATE addresses 
SET 
  latitude = -8.9167, 
  longitude = 13.1833, 
  radius_km = 8, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Talatona%'
LIMIT 1;

-- Kilamba
UPDATE addresses 
SET 
  latitude = -8.9500, 
  longitude = 13.2000, 
  radius_km = 7, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Kilamba%'
LIMIT 1;

-- Cacuaco
UPDATE addresses 
SET 
  latitude = -8.7833, 
  longitude = 13.3667, 
  radius_km = 8, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Cacuaco%'
LIMIT 1;

-- Belas
UPDATE addresses 
SET 
  latitude = -9.0500, 
  longitude = 13.1500, 
  radius_km = 9, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Belas%'
LIMIT 1;

-- Cazenga
UPDATE addresses 
SET 
  latitude = -8.8667, 
  longitude = 13.2833, 
  radius_km = 6, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Cazenga%'
LIMIT 1;

-- Maianga
UPDATE addresses 
SET 
  latitude = -8.8167, 
  longitude = 13.2500, 
  radius_km = 5, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Maianga%'
LIMIT 1;

-- Rangel
UPDATE addresses 
SET 
  latitude = -8.8333, 
  longitude = 13.2667, 
  radius_km = 5, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Rangel%'
LIMIT 1;

-- Sambizanga
UPDATE addresses 
SET 
  latitude = -8.8500, 
  longitude = 13.2500, 
  radius_km = 6, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Sambizanga%'
LIMIT 1;

-- Ingombota
UPDATE addresses 
SET 
  latitude = -8.8167, 
  longitude = 13.2333, 
  radius_km = 4, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Ingombota%'
LIMIT 1;

-- Samba
UPDATE addresses 
SET 
  latitude = -8.8833, 
  longitude = 13.2167, 
  radius_km = 7, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Samba%'
LIMIT 1;

-- Benfica
UPDATE addresses 
SET 
  latitude = -8.9000, 
  longitude = 13.2500, 
  radius_km = 6, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Benfica%'
LIMIT 1;

-- Morro Bento
UPDATE addresses 
SET 
  latitude = -8.8667, 
  longitude = 13.2333, 
  radius_km = 5, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Morro Bento%'
LIMIT 1;

-- Alvalade
UPDATE addresses 
SET 
  latitude = -8.8500, 
  longitude = 13.2167, 
  radius_km = 5, 
  is_zone = true,
  updated_at = NOW()
WHERE name LIKE '%Alvalade%'
LIMIT 1;

-- ============================================
-- VERIFICAR ZONAS CONFIGURADAS
-- ============================================

SELECT 
  id,
  name,
  price,
  latitude,
  longitude,
  radius_km,
  is_zone,
  CASE 
    WHEN latitude IS NOT NULL AND longitude IS NOT NULL AND is_zone = true 
    THEN '✅ Configurada'
    ELSE '❌ Não configurada'
  END as status
FROM addresses
WHERE is_zone = true OR name IN (
  'Luanda', 'Viana', 'Talatona', 'Kilamba', 'Cacuaco', 'Belas',
  'Cazenga', 'Maianga', 'Rangel', 'Sambizanga', 'Ingombota',
  'Samba', 'Benfica', 'Morro Bento', 'Alvalade'
)
ORDER BY name;

-- ============================================
-- ESTATÍSTICAS
-- ============================================

SELECT 
  COUNT(*) as total_addresses,
  SUM(CASE WHEN is_zone = true THEN 1 ELSE 0 END) as zonas_configuradas,
  SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) as com_coordenadas
FROM addresses;
