const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "söyle",
    description: "Şarkı çalmak için",
    usage: "[şarkı_adı]",
    aliases: ["sö","soyle","so","oynat","çal","ç","cal","c","p","söyle"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Şarkı söyleyebilmem için ses kanalında olman gerekiyor!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Ses kanalına katılamıyorum, yetki ver lan!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Ses kanalına katılamıyorum, yetki ver lan!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Ne yani, boş mu yapiyim?", message.channel);


    

    //problem: determine whether user enters a search string OR a url
    //solution 1: get the part after  /(https?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\/[^\s]+)  , the id,   const searched = await yts( { videoId: '_4Vt0UGwmgQ' } )
    const regex = /(https?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\/[^\s]+)/ui
    ///const id = url.searchParams.get('id') ?? url.pathname
    //https://javascript.info/regexp-introduction
    const match = searchString.match(regex)
    if(match) {
      //var searched = ytdl(searchString);
      const videoId = ytdl.getURLVideoID(searchString)
      var songInfo = await yts( { videoId: {videoId} } )
      //if(searched.length === 0)return sendError("Dalga mı geçiyorsun? Böyle bir şarkı yok.", message.channel)
      //var songInfo = searched;
    } else { // if it is a search string (and not a url)   
      var searched = await yts.search(searchString)
      if(searched.videos.length === 0)return sendError("Dalga mı geçiyorsun? Böyle bir şarkı yok.", message.channel)
      
      var songInfo = searched.videos[0]
      const id = songInfo.videoId
    }
 
    // https://github.com/fent/node-ytdl-core

    var serverQueue = message.client.queue.get(message.guild.id);


    const song = {
      //id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(), // ${ song.duration.timestamp }
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
        queue.voiceChannel.leave(); // If you want your bot stay in vc 24/7 remove this line :D
        message.client.queue.delete(message.guild.id);
        return;
      }
      // if str.includes("https://youtu") || str.includes("http://youtu") || str.includes("youtube.com/watch?v=")
      // if str.includes("https://youtu" || "http://youtu" || "youtube.com/watch?v=")
      const dispatcher = queue.connection
        .play(ytdl(song.url, {filter: "audioonly"} ))
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