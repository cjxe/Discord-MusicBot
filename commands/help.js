const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "yardım",
        description: "Tüm komutları göstermek için",
        usage: "[komut]",
        aliases: ["yardim","komutlar","commands", "help","yardım"]
    },

    run: async function(client, message, args){
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds+="``"+client.config.prefix+cmdinfo.name+" "+cmdinfo.usage+"`` ~ "+cmdinfo.description+"\n"
        })

        let embed = new MessageEmbed()
        .setAuthor(client.user.username+"'ın komutları", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
        .setColor("BLUE")
        .setDescription(allcmds)
        .setFooter(`Yapabileceğin her komut hakkında bilgi almak için ${client.config.prefix}yardım [komut]`)

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
            if(!command)return message.channel.send("Komut bulunamadı")
            let commandinfo = new MessageEmbed()
            .setTitle("Komut: "+command.info.name+" hakkında bilgi")
            .setColor("YELLOW")
            .setDescription(`
Ad: ${command.info.name}
Açıklama: ${command.info.description}
Kullanım: \`\`${client.config.prefix}${command.info.name} ${command.info.usage}\`\`
Başka adlar: ${command.info.aliases.join(", ")}
`)
            message.channel.send(commandinfo)
        }
    }
}
