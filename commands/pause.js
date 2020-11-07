const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "duraklat",
    description: "Şimdi çalan müziği durdurmak için",
    usage: "",
    aliases: ["dut","düt","pause","duraklat"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      let xd = new MessageEmbed()
      .setDescription("⏸ Öhm, bölüyorum ama!..")
      .setColor("YELLOW")
      .setAuthor("Müzik durduruldu!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      return message.channel.send(xd);
    }
    return sendError("Şu anda boştayım.", message.channel);
  },
};
