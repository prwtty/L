const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    name: 'poll',
    usage: '[#channel] [what is the poll]',
    description : "Admins can make polls.",
    userPermission: ["MANAGE_MESSAGES"],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let pollChannel = message.mentions.channels.first();
        let pollDescription = args.slice(1).join(' ');
        let embedPoll = new MessageEmbed()
        .setTitle('New Poll!')
        .setDescription(pollDescription)
        .setColor('YELLOW')
        let msgEmbed = await pollChannel.send({ embeds: [embedPoll] });
        await msgEmbed.react('👍')
        await msgEmbed.react('👎')
    }
}