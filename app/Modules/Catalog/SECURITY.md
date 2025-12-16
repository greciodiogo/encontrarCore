# 🔒 SEGURANÇA - Banco de Dados Compartilhado

## Situação Atual

```
┌─────────────────────────────────────────────────────┐
│  PRODUÇÃO - Banco de Dados PostgreSQL (Railway)     │
│  ├── NestJS Microserviço (GERENCIADOR)              │
│  │   ├── Cria/Atualiza/Deleta tabelas               │
│  │   ├── Executa migrações                          │
│  │   └── Admin & Ecommerce                          │
│  │                                                   │
│  └── Adonis Microserviço (ESTE) (CONSUMIDOR)        │
│      ├── Apenas lê dados                            │
│      ├── SEM permissão para alterar estrutura       │
│      └── App específica                             │
└─────────────────────────────────────────────────────┘
```

## Procedimento de Segurança

### ✅ O que FAZER

1. **Ler dados com segurança**
   ```javascript
   const products = await Product.query().fetch()
   ```

2. **Testar conexão com read-only**
   ```
   GET /api/v1/test/health
   GET /api/v1/test/db-connection
   ```

3. **Monitorar logs de erro**
   - Verifique a conexão regularmente
   - Alerte se houver problemas de conexão

4. **Usar variáveis de ambiente**
   - Todas as credenciais devem estar no `.env`
   - Nunca commitar credenciais no código

### ❌ O que NÃO FAZER

1. **Executar migrações em produção**
   ```bash
   # ❌ NUNCA faça isso:
   npm run migration:run
   npm run migration:refresh
   prisma migrate deploy
   ```

2. **Alterar estrutura de tabelas**
   ```javascript
   // ❌ Evite usar Schema builder em produção
   this.create('products', (table) => { ... })
   this.alter('products', (table) => { ... })
   ```

3. **Tentar droppar tabelas**
   ```javascript
   // ❌ NUNCA faça isso em produção
   this.drop('products')
   ```

4. **Usar credenciais com permissão de escrita em tabelas críticas**
   - Use um usuário PostgreSQL read-only se possível
   - Separe credenciais de leitura e escrita

5. **Commitar segredos no código**
   ```javascript
   // ❌ Nunca
   const password = "thBxChNccOkKtJjjTFzStchXZRDXbSjI"
   
   // ✅ Sempre
   const password = process.env.DB_PASSWORD
   ```

## Checklist de Segurança Pré-Produção

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Nenhuma migration será executada em produção
- [ ] Todas as queries são read-only onde necessário
- [ ] Credenciais PostgreSQL não estão no código
- [ ] Testes de conexão passam sem modificar banco
- [ ] Logs estão configurados para monitorar erros
- [ ] Backup da configuração `.env` está seguro
- [ ] Equipe NestJS está ciente desta integração

## Processo de Deployment

### 1. Validar em Desenvolvimento
```bash
# Instalar dependências
npm install

# Testar conexão (read-only)
npm run serve:dev
curl http://localhost:3000/api/v1/test/health
```

### 2. Validar em Staging
```bash
# Fazer deploy em staging com credenciais de teste
# Executar testes de conexão
curl https://staging.com/api/v1/test/health
```

### 3. Deploy em Produção
```bash
# IMPORTANTE: Não executar migrations!
# Apenas fazer deploy do código

git push origin main

# O CI/CD deve:
# 1. Instalar dependências
# 2. Compilar código
# 3. Fazer deploy
# 4. NÃO executar migrations
# 5. Executar health check
```

### 4. Pós-Deployment
```bash
# Testar endpoints
curl https://seu-dominio.com/api/v1/test/health

# Verificar logs
tail -f logs/adonis.log | grep -i "database\|connection"

# Validar dados
curl https://seu-dominio.com/api/v1/products
```

## Comunicação com Equipe NestJS

Quando integrar com o NestJS:

1. **Informar sobre esta aplicação**
   - "Temos uma aplicação Adonis que consome produtos"
   - "Apenas faz leitura da tabela products"
   - "Sem permissão para alterar estrutura"

2. **Pedir informações sobre a tabela**
   - Quais colunas existem?
   - Há índices específicos?
   - Há constraints a respeitar?

3. **Acordar sobre mudanças futuras**
   - Se a tabela mudar, avisar antes
   - Sincronizar versões do schema

4. **Monitorar coordenação**
   - Usar issue tracker para mudanças
   - Documentar alterações de schema

## Monitoramento

### Logs Importantes

```javascript
// Em app/Modules/Catalog/Services/ProductService.js
// Adicione logging para rastrear problemas

try {
  const products = await this.productRepository.getAll(page, limit)
  Logger.info('Produtos recuperados com sucesso', { count: products.length })
} catch (error) {
  Logger.error('Erro ao recuperar produtos', error)
  // Alertar time sobre problema de conexão
}
```

### Alertas Configurar

1. **Erro de conexão com banco**
   - Verificar credenciais
   - Verificar status do PostgreSQL
   - Notificar admin

2. **Erro de permissão**
   - Usuário não tem permissão suficiente
   - Verificar usuário PostgreSQL

3. **Timeout de query**
   - Há muitos dados?
   - Há índices faltando?
   - Consultar time NestJS

## Referências

- [PostgreSQL Read-Only User](https://www.postgresql.org/docs/current/sql-createrole.html)
- [Adonis Security](https://adonisjs.com/docs/4.1/security)
- [Ambiente Variables](https://adonisjs.com/docs/4.1/config#environment-variables)
- [Database Transactions](https://adonisjs.com/docs/4.1/database#transactions)
