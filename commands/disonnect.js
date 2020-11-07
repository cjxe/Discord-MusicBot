const { MessageEmbed } = require("discord.js");

module.exports = {
    info: {
        name: "ayrıl",
        description: "Kanaldan ayrılmak için",
        usage: "",
        aliases: ["ay","ayril","disconnect","disc","dc"],
    },

    // error handle:
    // 1- when bot dc, stop the music and clear the queue
    run: async function (client, message, args) {
        const channel = message.member.voice.channel;
        const serverQueue = message.client.queue.get(message.guild.id);
        
        if (!channel)return sendError("Ayrılabilmek için ses kanalında olmam gerekiyor!", message.channel);
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("Şarkıyı durdur");

        channel.leave();
        message.react("👋");
    },
};