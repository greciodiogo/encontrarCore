# Instruções para Aplicar Migration de Notificações

## Arquivo Criado
`database/migrations/1743408000000_add_notification_enhancements_schema.js`

## O que esta migration faz?
Adiciona os seguintes campos à tabela `notifications`:
- `relatedEntityId` - ID da entidade relacionada (ex: ID do pedido, produto)
- `actionUrl` - URL para navegação quando a notificação é clicada
- `updatedAt` - Timestamp de atualização
- Índices para melhor performance nas queries

## Como Aplicar

### Opção 1: Usando o comando do Adonis (Recomendado)

```bash
cd encontrarCore
node ace migration:run
```

### Opção 2: Aplicar apenas esta migration específica

```bash
cd encontrarCore
node ace migration:run --files=1743408000000_add_notification_enhancements_schema.js
```

## Verificação

Após rodar a migration, verifique se as colunas foram criadas:

```bash
node ace migration:status
```

Ou conecte ao banco de dados e execute:

```sql
\d notifications
```

## Rollback (se necessário)

Se precisar reverter a migration:

```bash
node ace migration:rollback --batch=0
```

Ou para reverter apenas esta migration:

```bash
node ace migration:rollback --files=1743408000000_add_notification_enhancements_schema.js
```

## Notas Importantes

1. A coluna `type` já existe na tabela (adicionada em migration anterior)
2. Esta migration adiciona os campos complementares necessários
3. Os índices melhoram a performance das queries de notificações
4. Registros existentes terão `type = 'general'` por padrão

## Após a Migration

1. Reinicie o servidor AdonisJS
2. Teste o endpoint de notificações
3. Verifique se não há erros no console

## Troubleshooting

Se encontrar erro de "coluna já existe":
- Verifique se a migration já foi executada: `node ace migration:status`
- Se sim, não precisa rodar novamente

Se encontrar erro de conexão com banco:
- Verifique as credenciais no arquivo `.env`
- Certifique-se que o banco de dados está rodando
