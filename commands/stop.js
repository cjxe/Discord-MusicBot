const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "dur",
    description: "Müziği durdurup sırayı temizlemek için",
    usage: "",
    aliases: ["du","durdur","dur-lan","kes","dur"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Şarkı söyleyebilmem için odaya katılman gerekiyor!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Çalan hiçbir şey yokki durdurayım gerizekalı...", message.channel);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Şarkıyı durdur");
    message.react("✅")
  },
};
