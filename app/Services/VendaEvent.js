"use strict";
const MovimentarStockService = use('App/Modules/Logistica/Services/MovimentarStockService')
const VendaEvent = (exports = module.exports = {});

VendaEvent.newVendaRegMovStock = async (Produtos, UserId, Movimento='SAIDA', TipoMovimentoStock=null) => {
    for (let index = 0; index < Produtos.length; index++) {
        const produto = Produtos[index]; 
        Movimento =='SAIDA'?
       await new MovimentarStockService().vendaDarSaidaProdutoStock(produto, UserId)
       : await new MovimentarStockService().vendaDarEntradaProdutoStock(produto, UserId, TipoMovimentoStock);
    }
};
