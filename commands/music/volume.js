const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require("discord.js");
const progressbar = require('string-progressbar');

module.exports = {
    name: 'volume',
    aliases : ['v'],
    usage: '[0-100]',
    description : "Change the music player's volume.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(process.env.MUSIC === "false") return message.reply({ embeds: [
          new MessageEmbed()
            .setAuthor(`${client.user.username} will not be doing music anymore, please \`${client.prefix(message)}youtube\``)
            .setColor("BLUE")
        ]})
        let voiceChannel = message.guild.me.voice.channel
        if(voiceChannel) {
          if(voiceChannel.id && message.member.voice.channel.id !== voiceChannel.id) return message.channel.send({ embeds: [
            new MessageEmbed()
                .setDescription("You are not in my voice channel")
                .setColor("YELLOW")
          ]});
        }
        if(message.guild.me.voice.channel.id && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embeds: [
          new MessageEmbed()
              .setDescription("You are not in my voice channel")
              .setColor("YELLOW")
        ]});
        const amount = Number(args[0]);
        const queue = client.player.getQueue(message)
        if(!queue) return message.channel.send({ embeds: [
            new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
        ]})
        if(!amount) return message.channel.send({ embeds: [
            new MessageEmbed()
                .setDescription(`🔊 **|** The current volume is **\`${queue.volume}\`**`)
                .setFooter(bar)
                .setColor("#5400FF")
        ]});
        if(amount < 0) {
            amount = 0;
            var total = 100;
            var current = amount;
            let bar = progressbar.filledBar(total, current, 40, "□", "■")[0];
            const embed = new MessageEmbed()
                .setDescription(`🔊 **|** Volume set to **\`${amount}\`**`)
                .setFooter(bar)
                .setColor("#5400FF")
            return message.channel.send({ embeds: [embed] })
        }
        if(amount > 100) {
            message.channel.send(`I can't set the volume above **\`100\`**`);
        } else if(amount === 0) {
            message.channel.send("Please pause the music player instead of setting the volume to **\`0\`**");
        } else {
            client.player.setVolume(message, amount);
            var total = 100;
            var current = amount;
            let bar = progressbar.filledBar(total, current, 40, "□", "■")[0];
            const embed = new MessageEmbed()
                .setDescription(`🔊 **|** Volume set to **\`${amount}\`**`)
                .setFooter(bar)
                .setColor("#5400FF")
            message.channel.send({ embeds: [embed] })
        }
    },
};
