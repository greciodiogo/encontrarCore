/**
 * Configuração centralizada de tipos de email
 * Define automaticamente o remetente correto baseado no tipo
 */

const EMAIL_TYPES = {
  // Emails transacionais (não podem responder)
  transactional: {
    from: 'Encontrar <noreply@encontrarshopping.com>',
    replyTo: 'suporte@encontrarshopping.com',
    description: 'Emails automáticos do sistema',
    examples: ['Reset de senha', 'Confirmação de cadastro', 'Verificação de email']
  },

  // Emails de pedidos (podem responder)
  orders: {
    from: 'Encontrar Pedidos <pedidos@encontrarshopping.com>',
    replyTo: 'pedidos@encontrarshopping.com',
    description: 'Confirmações e atualizações de pedidos',
    examples: ['Pedido confirmado', 'Pedido enviado', 'Pedido entregue']
  },

  // Emails de suporte (podem responder)
  support: {
    from: 'Encontrar Suporte <suporte@encontrarshopping.com>',
    replyTo: 'suporte@encontrarshopping.com',
    description: 'Comunicação de suporte ao cliente',
    examples: ['Resposta a dúvida', 'Solução de problema', 'Acompanhamento']
  },

  // Emails de marketing (podem responder)
  marketing: {
    from: 'Encontrar Marketing <marketing@encontrarshopping.com>',
    replyTo: 'marketing@encontrarshopping.com',
    description: 'Promoções, newsletters e ofertas',
    examples: ['Newsletter', 'Promoção', 'Lançamento de produto']
  },

  // Emails para vendedores (podem responder)
  sellers: {
    from: 'Encontrar Vendas <vendas@encontrarshopping.com>',
    replyTo: 'vendas@encontrarshopping.com',
    description: 'Notificações para vendedores',
    examples: ['Novo pedido', 'Produto vendido', 'Pagamento recebido']
  },

  // Emails de notificações (podem responder)
  notifications: {
    from: 'Encontrar Notificações <notificacoes@encontrarshopping.com>',
    replyTo: 'suporte@encontrarshopping.com',
    description: 'Notificações gerais do sistema',
    examples: ['Produto disponível', 'Preço alterado', 'Favorito em promoção']
  }
};

/**
 * Obter configuração de email por tipo
 * @param {string} type - Tipo do email
 * @returns {Object} Configuração do email
 */
function getEmailConfig(type) {
  const config = EMAIL_TYPES[type];
  
  if (!config) {
    console.warn(`⚠️  Tipo de email '${type}' não encontrado, usando 'transactional'`);
    return EMAIL_TYPES.transactional;
  }
  
  return config;
}

/**
 * Detectar tipo de email automaticamente baseado no assunto/contexto
 * @param {Object} emailData - Dados do email
 * @returns {string} Tipo detectado
 */
function detectEmailType(emailData) {
  const subject = (emailData.subject || '').toLowerCase();
  const context = (emailData.context || '').toLowerCase();
  
  // Pedidos
  if (subject.includes('pedido') || subject.includes('compra') || 
      subject.includes('order') || context === 'order') {
    return 'orders';
  }
  
  // Suporte
  if (subject.includes('suporte') || subject.includes('ajuda') || 
      subject.includes('dúvida') || context === 'support') {
    return 'support';
  }
  
  // Marketing
  if (subject.includes('promoção') || subject.includes('oferta') || 
      subject.includes('desconto') || subject.includes('newsletter') || 
      context === 'marketing') {
    return 'marketing';
  }
  
  // Vendedores
  if (subject.includes('vendedor') || subject.includes('venda') || 
      context === 'seller') {
    return 'sellers';
  }
  
  // Notificações
  if (subject.includes('notificação') || subject.includes('alerta') || 
      context === 'notification') {
    return 'notifications';
  }
  
  // Transacional (padrão)
  if (subject.includes('senha') || subject.includes('password') || 
      subject.includes('verificação') || subject.includes('confirmação')) {
    return 'transactional';
  }
  
  // Default
  return 'transactional';
}

/**
 * Listar todos os tipos disponíveis
 * @returns {Array} Lista de tipos
 */
function listEmailTypes() {
  return Object.keys(EMAIL_TYPES).map(key => ({
    type: key,
    ...EMAIL_TYPES[key]
  }));
}

module.exports = {
  EMAIL_TYPES,
  getEmailConfig,
  detectEmailType,
  listEmailTypes
};
