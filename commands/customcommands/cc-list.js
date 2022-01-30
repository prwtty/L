const { MessageEmbed, Message, Client } = require('discord.js');
const schema = require('../../models/cc');

module.exports = {
    name: 'cc-list',
    description: "List the custom commands!",
    guildPremium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const data  = await schema.find({ Guild: message.guild.id });
        if(!!data === false) return message.channel.send('There is no custom commands!');
        message.channel.send({ embeds: [
            new MessageEmbed()
                .setColor('BLUE')
                .setDescription(
                    data.map((cmd, i) =>
                        `${i + 1}: ${cmd.Command}`
                    ).join('\n')
                )
        ]})
    }
}
