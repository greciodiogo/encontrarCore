'use strict'

class TesteController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  Login(){
    //console.log('Utilizador conectado')
  }

  onMessage(data) {
    for (let index = 1; index <= 100 ; index++) {
        var teste = (index*100)/100
    this.socket.broadcastToAll("message", teste)
   }
  }

  onClose () {
    socket.on('close')
  }

  onError () {
    socket.on('error')
  }

}

module.exports = TesteController
