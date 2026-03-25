'use strict'

/**
 * Enum para os estados possíveis de uma loja
 */
const ShopStatus = {
  OPEN: 'OPEN',                       // Aberta (dentro do horário de funcionamento)
  CLOSED: 'CLOSED',                   // Fechada (fora do horário de funcionamento)
  PAUSED: 'PAUSED',                   // Pausada temporariamente pelo dono
  MANUALLY_CLOSED: 'MANUALLY_CLOSED'  // Fechada manualmente (sobrescreve horário)
}

module.exports = ShopStatus
