const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "şimdiçalan",
    description: "Şimdi çalanı göstermek için",
    usage: "",
    aliases: ["şç","sc","çalan","calan","simdicalan","şimdi-çalan","simdi-calan","nowplaying","np","şimdiçalan"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Şu anda boştayım.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Şimdi çalan", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Ad", song.title, true)
      .addField("Süre", song.duration, true)
      .addField("Talep eden", song.req.tag, true)
      .setFooter(`Görüntülenme: ${song.views} | ${song.ago}`)
    return message.channel.send(thing)
  },
};
