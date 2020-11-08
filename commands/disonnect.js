const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "ayrıl",
        description: "Kanaldan ayrılmak için",
        usage: "",
        aliases: ["ay","ayril","git","disconnect","disc","dc"],
    },

    // handle the error!
    run: async function (client, message, args) {
        const channel = message.member.voice.channel;
        const serverQueue = message.client.queue.get(message.guild.id);
        
        if (!channel) return sendError("Ayrılabilmem için ayni ses kanalında olmamız gerekiyor!", message.channel);
        // problem 1: SOLVED - komutu veren user vc'da degilse bot kanaldan cikmasin
        // problem 2: komutu verenle AYNI kanalada olmak gerkiyor
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end(); // bot disc yerse queue sifirlanacak
        
        channel.leave();
        message.react("👋"); 
    },
};


// how to test (as a dc user)
// join a vc:
// 1- ..p <any_music>   then   ..dc
// 2- ..p <any_music>   then ..p <any_music>   then   ..dc   then   ..q
// repeat while not in a vc