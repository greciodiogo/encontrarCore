

const Ws = use('Ws')

function Channel(channelName, channelMessage, data){
  const channel = Ws.getChannel(channelName);

  if (!channel) return;

  const topic = channel.topic(channelName)
  if (!topic) {
      return;
  }
  topic.broadcastToAll(channelMessage, data);
  return channel;
}



function broadcast(percent) { 
   Channel('teste','message' ,{percent});
}


module.exports = {
    broadcast,
}
