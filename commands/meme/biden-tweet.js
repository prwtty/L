const { Message, Client, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "biden-tweet",
    usage: '[text]',
    aliases: ['bt'],
    description: "Yep, you are sending a biden tweet.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const sentence = args.join(" ")
        if (!sentence) return message.channel.send('Please specify a query.')
        const embed = new MessageEmbed()
          .setTitle('Joe Biden')
          .setImage(`https://api.popcatdev.repl.co/biden?text=${encodeURIComponent(sentence)}`)
          .setColor('ORANGE')
          .setFooter(' ');
        message.channel.send({ embeds: [embed] })
    },
};