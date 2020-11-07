const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "davet",
    description: "Sunucuya davet etmek için",
    usage: "",
    aliases: ["da","sunucu","invite","inv","davet"],
  },

  run: async function (client, message, args) {
    
    //set the permissions id here (https://discordapi.com/permissions.html)
    var permissions = 37080128;
    
    let invite = new MessageEmbed()
    .setTitle(`${client.user.username}'ı davet et`)
    .setDescription(`Noldu, utandırdım dimi? Beni sunucuna davet et! \n\n [Buraya tıkla](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`)
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`)
    .setColor("BLUE")
    return message.channel.send(invite);
  },
};
