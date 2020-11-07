const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "sıra",
    description: "Sıradaki şarkıları göstermek için",
    usage: "",
    aliases: ["sı","si","sira","sırada","sirada","sıradaki","siradaki","liste", "q","queue", "songlist","sıra"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Şu anda boştayım.", message.channel);

    let queue = new MessageEmbed()
    .setAuthor("Sıradaki şarkılar", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    .addField("Şimdi çalan", serverQueue.songs[0].title, true)
    .addField("Metin kanalı", serverQueue.textChannel, true)
    .addField("Ses kanalı", serverQueue.voiceChannel, true)
    .setDescription(serverQueue.songs.map((song) => {
      if(song === serverQueue.songs[0])return
      return `**-** ${song.title}`
    }).join("\n"))
    .setFooter("Sunucu ses düzeyi "+serverQueue.volume)
    if(serverQueue.songs.length === 1)queue.setDescription(`Sırada istek parça yok, eklemek için \`\`${client.config.prefix}çal <şarkı_adı>\`\``)
    message.channel.send(queue)
  },
};
