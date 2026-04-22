# 📊 Guia Completo: Platform Tracking System

## ✅ O Que Foi Implementado

Sistema completo de tracking de requisições por plataforma (Android/iOS/Web) com:

1. ✅ Middleware global que captura todas as requisições
2. ✅ Tabela no banco de dados para armazenar analytics
3. ✅ Detecção automática de plataforma via User-Agent
4. ✅ Suporte para headers customizados
5. ✅ API de relatórios e dashboard
6. ✅ Tracking de performance (tempo de resposta)
7. ✅ Tracking de erros por plataforma

## 🗄️ Estrutura do Banco de Dados

### Tabela: `request_analytics`

```sql
- request_id: ID único da requisição
- method: GET, POST, PUT, DELETE
- endpoint: URL da requisição
- status_code: 200, 404, 500, etc
- response_time_ms: Tempo de resposta em milissegundos

- platform: android, ios, web-chrome, web-safari, postman
- platform_version: Android 13, iOS 16.5, Chrome 120
- app_version: 1.0.0, 1.1.0, 1.2.0
- device_model: iPhone 14 Pro, Samsung Galaxy S23
- os_version: 13, 16.5

- user_agent: User-Agent completo
- client_type: mobile-app, web-app, api-client
- ip_address: IP do cliente
- user_id: ID do usuário (se autenticado)

- request_headers: Headers importantes (JSON)
- query_params: Query parameters (JSON)
- error_message: Mensagem de erro (se houver)
```

## 🚀 Como Usar

### 1. Rodar Migration

```bash
cd encontrarCore
node ace migration:run
```

### 2. Configurar Clientes

#### 📱 Flutter/Dart (Mobile App)

Adicionar headers customizados em todas as requisições:

```dart
// packages/remote/lib/remote_implementation.dart

import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'dart:io';

class RemoteImplementation {
  Future<Map<String, String>> _getPlatformHeaders() async {
    final deviceInfo = DeviceInfoPlugin();
    final packageInfo = await PackageInfo.fromPlatform();
    
    String platform;
    String deviceModel;
    String osVersion;
    
    if (Platform.isAndroid) {
      final androidInfo = await deviceInfo.androidInfo;
      platform = 'android';
      deviceModel = '${androidInfo.manufacturer} ${androidInfo.model}';
      osVersion = androidInfo.version.release;
    } else if (Platform.isIOS) {
      final iosInfo = await deviceInfo.iosInfo;
      platform = 'ios';
      deviceModel = iosInfo.utsname.machine;
      osVersion = iosInfo.systemVersion;
    } else {
      platform = 'unknown';
      deviceModel = 'unknown';
      osVersion = 'unknown';
    }
    
    return {
      'X-Platform': platform,
      'X-App-Version': packageInfo.version,
      'X-Device-Model': deviceModel,
      'X-OS-Version': osVersion,
      'X-Client-Type': 'mobile-app',
      'User-Agent': 'Encontrar-$platform/${packageInfo.version}',
    };
  }
  
  Future<Response> get(String endpoint) async {
    final headers = await _getPlatformHeaders();
    
    return await dio.get(
      endpoint,
      options: Options(headers: headers),
    );
  }
  
  // Aplicar em todos os métodos: post, put, delete, etc
}
```

**Dependências necessárias** (`pubspec.yaml`):
```yaml
dependencies:
  device_info_plus: ^9.1.0
  package_info_plus: ^5.0.1
```

#### 🌐 Next.js/React (Web App)

Criar um interceptor Axios:

```typescript
// lib/api/axios-config.ts

import axios from 'axios';

// Detectar browser e versão
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 'unknown';
  
  if (ua.includes('Chrome')) {
    browserName = 'chrome';
    const match = ua.match(/Chrome\/([\d.]+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Firefox')) {
    browserName = 'firefox';
    const match = ua.match(/Firefox\/([\d.]+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'safari';
    const match = ua.match(/Version\/([\d.]+)/);
    browserVersion = match ? match[1] : 'unknown';
  }
  
  return { browserName, browserVersion };
}

// Detectar OS
function getOSInfo() {
  const ua = navigator.userAgent;
  let os = 'unknown';
  let osVersion = 'unknown';
  
  if (ua.includes('Windows')) {
    os = 'Windows';
    const match = ua.match(/Windows NT ([\d.]+)/);
    osVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    const match = ua.match(/Mac OS X ([\d_]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : 'unknown';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  }
  
  return { os, osVersion };
}

// Configurar Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para adicionar headers
api.interceptors.request.use((config) => {
  const { browserName, browserVersion } = getBrowserInfo();
  const { os, osVersion } = getOSInfo();
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  
  config.headers['X-Platform'] = `web-${browserName}`;
  config.headers['X-App-Version'] = appVersion;
  config.headers['X-Device-Model'] = `${os} ${osVersion}`;
  config.headers['X-OS-Version'] = osVersion;
  config.headers['X-Client-Type'] = 'web-app';
  config.headers['User-Agent'] = `Encontrar-Web/${appVersion} (${browserName}/${browserVersion})`;
  
  return config;
});

export default api;
```

**Uso:**
```typescript
import api from '@/lib/api/axios-config';

// Todas as requisições terão os headers automaticamente
const response = await api.get('/products');
const data = await api.post('/orders', orderData);
```

## 📊 API de Analytics

### 1. Dashboard Geral

```bash
GET /api/analytics/dashboard?days=7
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "days": 7,
      "start_date": "2026-02-20T00:00:00.000Z",
      "end_date": "2026-02-27T00:00:00.000Z"
    },
    "summary": {
      "total_requests": 15234,
      "error_rate": "2.5%",
      "total_errors": 381
    },
    "by_platform": [
      { "platform": "android", "total": 8500 },
      { "platform": "ios", "total": 4200 },
      { "platform": "web-chrome", "total": 2534 }
    ],
    "by_day": [
      { "date": "2026-02-20", "total": 2100 },
      { "date": "2026-02-21", "total": 2300 }
    ],
    "top_endpoints": [
      {
        "endpoint": "/api/products",
        "method": "GET",
        "total": 3500,
        "avg_response_time": 145.5
      }
    ],
    "app_versions": [
      { "app_version": "1.1.0", "platform": "android", "total": 5000 },
      { "app_version": "1.0.9", "platform": "android", "total": 3500 }
    ],
    "top_devices": [
      { "device_model": "iPhone 14 Pro", "platform": "ios", "total": 1200 },
      { "device_model": "Samsung Galaxy S23", "platform": "android", "total": 980 }
    ]
  }
}
```

### 2. Analytics por Plataforma

```bash
GET /api/analytics/platform/android?days=7&page=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "android",
    "summary": {
      "total": 8500,
      "avg_response_time": 156.3,
      "max_response_time": 3500,
      "min_response_time": 45
    },
    "requests": {
      "total": 8500,
      "perPage": 50,
      "page": 1,
      "data": [...]
    }
  }
}
```

### 3. Comparar Plataformas

```bash
GET /api/analytics/compare?days=7
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "platform": "android",
      "total_requests": 8500,
      "avg_response_time": 156.3,
      "errors": 180
    },
    {
      "platform": "ios",
      "total_requests": 4200,
      "avg_response_time": 142.1,
      "errors": 95
    },
    {
      "platform": "web-chrome",
      "total_requests": 2534,
      "avg_response_time": 189.7,
      "errors": 106
    }
  ]
}
```

### 4. Endpoints Mais Lentos

```bash
GET /api/analytics/slow-endpoints?days=7&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "endpoint": "/api/orders/export",
      "method": "GET",
      "platform": "web-chrome",
      "total_requests": 45,
      "avg_response_time": 3500.5,
      "max_response_time": 8900
    }
  ]
}
```

### 5. Erros por Plataforma

```bash
GET /api/analytics/errors?days=7&platform=android
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "endpoint": "/api/products/123",
      "method": "GET",
      "status_code": 404,
      "platform": "android",
      "error_message": "Not Found",
      "total": 45
    }
  ]
}
```

## 📈 Casos de Uso

### 1. Monitorar Adoção de Nova Versão

```bash
GET /api/analytics/dashboard?days=30
```

Ver em `app_versions` quantos usuários estão em cada versão.

### 2. Identificar Problemas por Plataforma

```bash
GET /api/analytics/errors?platform=ios
```

Ver se iOS tem mais erros que Android.

### 3. Otimizar Performance

```bash
GET /api/analytics/slow-endpoints?days=7
```

Identificar endpoints lentos e otimizar.

### 4. Análise de Dispositivos

Ver em `top_devices` quais dispositivos são mais usados para priorizar testes.

## 🔍 Queries Úteis (SQL Direto)

### Requisições por hora (hoje)

```sql
SELECT 
  HOUR(created_at) as hour,
  platform,
  COUNT(*) as total
FROM request_analytics
WHERE DATE(created_at) = CURDATE()
GROUP BY HOUR(created_at), platform
ORDER BY hour, total DESC;
```

### Taxa de sucesso por plataforma

```sql
SELECT 
  platform,
  COUNT(*) as total,
  SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) as success,
  ROUND(SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as success_rate
FROM request_analytics
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY platform;
```

### Usuários mais ativos

```sql
SELECT 
  user_id,
  platform,
  COUNT(*) as total_requests,
  AVG(response_time_ms) as avg_response_time
FROM request_analytics
WHERE user_id IS NOT NULL
  AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY user_id, platform
ORDER BY total_requests DESC
LIMIT 20;
```

## 🎯 Boas Práticas

### 1. Limpeza de Dados Antigos

Criar um job para limpar dados antigos:

```javascript
// app/Tasks/CleanOldAnalytics.js
const RequestAnalytics = use('App/Models/RequestAnalytics')

class CleanOldAnalytics {
  static get schedule() {
    return '0 2 * * *' // Todo dia às 2h da manhã
  }

  async handle() {
    const daysToKeep = 90
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const deleted = await RequestAnalytics
      .query()
      .where('created_at', '<', cutoffDate)
      .delete()

    console.log(`🗑️  Deletados ${deleted} registros antigos de analytics`)
  }
}

module.exports = CleanOldAnalytics
```

### 2. Desabilitar Tracking em Desenvolvimento

```javascript
// .env
ENABLE_ANALYTICS=true  # Produção
ENABLE_ANALYTICS=false # Desenvolvimento
```

```javascript
// app/Middleware/PlatformTracker.js
async handle({ request, response, auth }, next) {
  const enabled = Env.get('ENABLE_ANALYTICS', 'true') === 'true'
  
  if (!enabled) {
    return await next()
  }
  
  // ... resto do código
}
```

### 3. Sampling (Não rastrear 100%)

Para reduzir volume de dados:

```javascript
async handle({ request, response, auth }, next) {
  const samplingRate = parseFloat(Env.get('ANALYTICS_SAMPLING_RATE', '1.0'))
  
  // Só rastrear X% das requisições
  if (Math.random() > samplingRate) {
    return await next()
  }
  
  // ... resto do código
}
```

## 🚨 Troubleshooting

### Analytics não está salvando

1. Verificar se migration rodou:
```bash
node ace migration:status
```

2. Verificar logs do servidor:
```bash
tail -f logs/adonis.log
```

3. Verificar se middleware está registrado:
```javascript
// start/kernel.js
'App/Middleware/PlatformTracker'  // Deve estar aqui
```

### Headers não estão sendo enviados

**Mobile:**
- Verificar se `device_info_plus` e `package_info_plus` estão instalados
- Verificar permissões no AndroidManifest.xml e Info.plist

**Web:**
- Verificar se interceptor Axios está configurado
- Verificar no DevTools > Network > Headers

### Performance Impact

O middleware é assíncrono e não bloqueia a resposta. Mas se tiver muito tráfego:

1. Usar sampling (rastrear apenas 10-20%)
2. Usar queue/job para salvar analytics
3. Usar banco separado para analytics

## 📊 Dashboard Visual (Opcional)

Podes criar um dashboard visual usando:

- **Metabase**: Conectar ao PostgreSQL e criar dashboards
- **Grafana**: Para visualizações em tempo real
- **Custom React Dashboard**: Consumir a API de analytics

## ✅ Checklist de Implementação

- [ ] Rodar migration
- [ ] Configurar headers no Flutter app
- [ ] Configurar headers no Next.js app
- [ ] Testar requisições e verificar BD
- [ ] Criar job de limpeza de dados antigos
- [ ] Configurar alertas para erros
- [ ] Criar dashboard visual (opcional)

## 🎉 Pronto!

Agora tens tracking completo de todas as requisições por plataforma! 🚀
