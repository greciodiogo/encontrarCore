"use strict";

const ServicoEvent = (exports = module.exports = {});
const ServicoService = use("App/Modules/CRM/Services/ServicoService");
const Database = use('Database');

ServicoEvent.new2ViaSimCard = async (chaveServico, newSimCardId, UserId)=> {
  const  servicoService = new ServicoService();
  await servicoService.emitir2ViaSimCard(chaveServico, newSimCardId, UserId);
};
