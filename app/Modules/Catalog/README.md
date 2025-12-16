# Módulo de Produtos

Este módulo é responsável por gerenciar os produtos da aplicação e testar a conexão com o banco de dados PostgreSQL compartilhado com o microserviço NestJS em produção.

## ⚠️ IMPORTANTE - Banco de Dados Compartilhado

O banco de dados **JÁ EXISTE** em outro microserviço (NestJS) que atende aplicações admin e ecommerce. Este microserviço (Adonis) foi criado EXCLUSIVAMENTE para atender a app.

### Regras de Ouro:
- ❌ **NUNCA** execute migrations em produção
- ❌ **NUNCA** modifique a estrutura de tabelas
- ✅ **APENAS** leia dados existentes
- ✅ Use apenas operações **read-only** para validação

## Estrutura

- **Models**: Define o modelo Lucid do Produto (apenas leitura)
- **Repositories**: Lógica de acesso aos dados
- **Services**: Lógica de negócio
- **Controllers**: Controladores HTTP
- **Routes**: Definição das rotas da API
- **Validators**: Validadores de entrada

## Endpoints de Teste (READ-ONLY - Seguro para Produção)

### 1. Health Check
```
GET /api/v1/test/health
```
Verifica se a conexão com o banco está funcionando.

**Resposta de sucesso:**
```json
{
  "success": true,
  "status": "healthy",
  "database": {
    "connected": true,
    "productsTableExists": true
  },
  "environment": "production",
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

### 2. Teste de Conexão
```
GET /api/v1/test/db-connection
```
Valida a conexão com PostgreSQL.

### 3. Verificar Estrutura da Tabela
```
GET /api/v1/test/verify-products-table
```
Retorna as colunas e tipos de dados da tabela products.

### 4. Informações da Tabela
```
GET /api/v1/test/table-info
```
Retorna índices, constraints e total de registros.

### 5. Listar Produtos (Primeiros 10)
```
GET /api/v1/test/list-products
```
Busca apenas leitura dos primeiros 10 produtos.

## Endpoints da API (CRUD Completo)

### Listar Produtos
```
GET /api/v1/products?page=1&limit=15
```

### Obter Produto por ID
```
GET /api/v1/products/:id
```

### Criar Novo Produto
```
POST /api/v1/products
Body:
{
  "name": "Nome do Produto",
  "description": "Descrição",
  "price": 10.50,
  "quantity": 100,
  "category": "Categoria"
}
```

### Atualizar Produto
```
PUT /api/v1/products/:id
Body:
{
  "name": "Novo Nome",
  "price": 15.00,
  ...
}
```

### Deletar Produto
```
DELETE /api/v1/products/:id
```

### Buscar Produtos
```
GET /api/v1/products/search?name=produto
```

### Contar Produtos
```
GET /api/v1/products/count
```

## Setup Inicial

### 1. Instalar Dependências PostgreSQL
```bash
npm install pg
```

### 2. Validar Conexão com BD
```bash
# Iniciar o servidor
adonis serve --dev

# Em outro terminal, testar conexão
curl http://localhost:3000/api/v1/test/health
```

### 3. IMPORTANTE: Não Execute Migrations em Produção!
A migration de exemplo está em `database/migrations/1702662000000_products_table.js` apenas como referência. 

**Nunca execute:**
```bash
npm run migration:run  # ❌ NÃO FAÇA ISSO EM PRODUÇÃO!
```

## Validação em Produção

1. Verifique a conexão com o banco de dados:
```bash
curl https://seu-dominio.com/api/v1/test/health
```

2. Se receber `"status": "healthy"`, a comunicação está funcionando perfeitamente.

3. Monitore os logs para erros de conexão com o PostgreSQL.

## Fluxo de Segurança

```
┌─────────────────────────────────┐
│  Adonis (Esta Aplicação)        │
│  - Lê dados de Products         │
│  - Nenhuma criação de tabelas   │
│  - Sem migrações em prod        │
└────────────┬────────────────────┘
             │
             │ Read-Only Connection
             │
             ▼
┌─────────────────────────────────┐
│  PostgreSQL (Railway)           │
│  - Banco compartilhado          │
│  - Gerenciado pelo NestJS       │
│  - Usado por Admin & Ecommerce  │
└─────────────────────────────────┘
```

## Troubleshooting

### Conexão recusada
- Verifique credenciais no `.env`
- Verifique se PostgreSQL está acessível
- Teste com: `curl /api/v1/test/db-connection`

### Tabela não encontrada
- Verifique se a tabela `products` existe no banco
- Use: `curl /api/v1/test/verify-products-table`
- Consulte o admin do microserviço NestJS

### Erro de permissões
- Verifique se o usuário PostgreSQL tem permissão READ
- Certifique-se que não há tentativa de escrita em tabelas gerenciadas pelo NestJS

