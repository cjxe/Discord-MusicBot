const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "söyle",
    description: "Şarkı çalmak için",
    usage: "[şarkı_adı]",
    aliases: ["sö","soyle","so","çal","ç","cal","c","p","söyle"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Şarkı söyleyebilmem için ses kanalında olman gerekiyor!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Ses kanalına katılamıyorum, yetki ver lan!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Ses kanalına katılamıyorum, yetki ver lan!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Ne yani, boş mu yapiyim?", message.channel);

    var serverQueue = message.client.queue.get(message.guild.id);

    var searched = await yts.search(searchString)
    if(searched.videos.length === 0)return sendError("Dalga mı geçiyorsun? Böyle bir şarkı yok.", message.channel)
    var songInfo = searched.videos[0]

    const song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("Şarkını sıraya ekledim", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .addField("Ad", song.title, true)
      .addField("Süre", song.duration, true)
      .addField("Talep eden", song.req.tag, true)
      .setFooter(`Görüntülenme: ${song.views} | ${song.ago}`)
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        sendError("Müzik bitti, ben kaçar!", message.channel)
        //queue.voiceChannel.leave();//If you want your bot stay in vc 24/7 remove this line :D
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let thing = new MessageEmbed()
      .setAuthor("Sessizlik! Şarkı başlasın...", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Ad", song.title, true)
      .addField("Süre", song.duration, true)
      .addField("Talep eden", song.req.tag, true)
      .setFooter(`Görüntülenme: ${song.views} | ${song.ago}`)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true)
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Ses kanalına bağlanamadım: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Ses kanalına bağlanamadım: ${error}`, message.channel);
    }
  }
};