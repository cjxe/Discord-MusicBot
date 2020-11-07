const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "sesdüzeyi",
    description: "To change the server song queue volume",
    usage: "[volume]",
    aliases: ["sd","ses","sesdüzeyi","ses-düzeyi","ses-duzeyi","v", "vol","sesdüzeyi"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Şarkı söyleyebilmem için ses kanalında olman gerekiyor!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Şu anda boştayım.", message.channel);
    if (!args[0])return message.channel.send(`Sunucu ses düzeyi: **${serverQueue.volume}**`);
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    let xd = new MessageEmbed()
    .setDescription(`Yeni sunucu ses düzeyi: **${args[0]/5}/5**(it will be divied by 5)`)
    .setAuthor("Sunucu ses düzeyi yöneticisi", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
