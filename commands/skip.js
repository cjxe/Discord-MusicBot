const sendError = require("../util/error");

module.exports = {
  info: {
    name: "atla",
    description: "Şarkıya atlamak için",
    usage: "",
    aliases: ["at","skip","s","atla"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Şarkı söyleyebilmem için ses kanalında olman gerekiyor!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Nasıl yanı, olmayan istek parçayı nasıl atlıyayım?", message.channel);
    serverQueue.connection.dispatcher.end("Şarkıyı atladım, zaten bok gibiydi...");
    message.react("👌")
  },
};
