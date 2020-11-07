const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "devam",
    description: "Durdurulan şarkıyı devam ettirmek için",
    usage: "",
    aliases: ["de","devamke","resume","devam"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ DURMAK YOK!")
      .setColor("GREEN")
      .setAuthor("Şarkıya devam!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      return message.channel.send(xd);
    }
    return sendError("Şu anda boştayım.", message.channel);
  },
};
