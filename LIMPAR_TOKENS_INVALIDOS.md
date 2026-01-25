# 🧹 Limpar Tokens Inválidos

## 📊 Situação Atual

Você tem muitos tokens inválidos no banco de dados:
- ❌ "Requested entity was not found" - Tokens expirados/app desinstalado
- ❌ "The registration token is not a valid FCM registration token" - Token malformado
- ✅ Alguns tokens válidos que funcionam

## 🔧 Solução Rápida

Execute o script de limpeza:

```bash
cd encontrarCore
node cleanup-invalid-tokens.js
```

**O que o script faz:**
1. Conecta ao banco de dados
2. Busca todos os tokens ativos
3. Valida cada token com o Firebase (dry run - não envia notificação)
4. Desativa automaticamente os tokens inválidos
5. Mostra um resumo

## ✅ Resultado Esperado

```
🧹 LIMPEZA DE TOKENS INVÁLIDOS
============================================================

1️⃣  Inicializando Firebase...
   ✓ Firebase inicializado

2️⃣  Buscando tokens ativos...
   ✓ Encontrados 15 token(s) ativo(s)

3️⃣  Validando tokens...
   ✓ Token válido: User 1 (Device-123)
   ✗ Token inválido: User 2 (Device-456)
     Erro: Requested entity was not found
   ...

4️⃣  Desativando 11 token(s) inválido(s)...
   ✓ Tokens desativados com sucesso

============================================================
📊 RESUMO:
   Total de tokens: 15
   ✓ Válidos: 4
   ✗ Inválidos: 11
   🗑️  Desativados: 11

✅ 4 token(s) válido(s) permanece(m) ativo(s)
🧹 11 token(s) inválido(s) foi(ram) desativado(s)
```

## 🔄 Limpeza Automática

O sistema agora desativa tokens automaticamente quando detecta erros:

```javascript
// No FirebaseService.js
if (!result.success && result.shouldDeactivate) {
  await this.deactivateToken(tokenId)
}
```

**Erros que desativam tokens automaticamente:**
- `messaging/registration-token-not-registered`
- `messaging/invalid-registration-token`
- `Requested entity was not found`
- `not a valid FCM registration token`
- `SenderId mismatch`

## 💡 Por Que Tokens Ficam Inválidos?

1. **App desinstalado** - Token não é mais válido
2. **Token expirado** - Firebase expira tokens antigos
3. **App reinstalado** - Novo token é gerado
4. **Projeto Firebase diferente** - SenderId mismatch
5. **Token corrompido** - Erro ao salvar no banco

## 🔍 Verificar Tokens Válidos

Após a limpeza, verifique quantos tokens válidos restaram:

```bash
# Via API (requer autenticação)
curl -X GET http://localhost:3381/api/notifications/test/my-tokens \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🎯 Testar Notificações Após Limpeza

```bash
# Enviar notificação de teste
curl -X POST http://localhost:3381/api/notifications/test/send-to-me \
  -H "Authorization: Bearer SEU_TOKEN"
```

Agora você deve ver apenas sucessos, sem erros!

## 📱 Usuários Precisam Fazer Login Novamente?

**Não necessariamente.** 

- Se o token do usuário ainda é válido, ele continua funcionando
- Se o token foi desativado, o usuário precisa:
  1. Abrir o app
  2. Fazer login novamente
  3. Novo token será registrado automaticamente

## 🔄 Manutenção Regular

Execute a limpeza periodicamente:

```bash
# Semanalmente ou mensalmente
node cleanup-invalid-tokens.js
```

Ou configure um cron job:

```bash
# Adicionar ao crontab (executar toda segunda-feira às 2h)
0 2 * * 1 cd /path/to/encontrarCore && node cleanup-invalid-tokens.js
```

## 📊 Monitoramento

Adicione logs para monitorar tokens inválidos:

```javascript
// No backend, ao enviar notificações
console.log(`✓ Sucesso: ${successCount}`)
console.log(`✗ Falhas: ${failureCount}`)
console.log(`🗑️  Tokens desativados: ${deactivatedCount}`)
```

## ✨ Melhorias Aplicadas

1. ✅ Script de limpeza criado
2. ✅ Desativação automática de tokens inválidos
3. ✅ Melhor tratamento de erros no Firebase
4. ✅ Logs mais informativos
5. ✅ Retorno estruturado com `shouldDeactivate`

## 🎯 Próximos Passos

1. Execute a limpeza: `node cleanup-invalid-tokens.js`
2. Teste notificações: `POST /api/notifications/test/send-to-me`
3. Verifique que não há mais erros
4. Configure limpeza periódica (opcional)

---

**Dúvidas?** Os tokens inválidos agora são desativados automaticamente pelo sistema.
