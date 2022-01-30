const { MessageEmbed, Message, Client, Collection } = require('discord.js');
const { antijoin } = require('../../collection/index');

module.exports = {
    name: 'antijoin',
    usage: '[on | off | list]',
    description : "Turn on/off antijoin system, this helps with raids and there is -antijoin list to see the player's that it kicked.",
    userPermission: ["ADMINISTRATOR"],
    botPermission: ["KICK_MEMBERS"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const query = args[0].toLowerCase();
        if(!query) return message.reply("Please specify a query!");
        const getCollection = antijoin.get(message.guild.id)
        if(query === "on") {
            if(getCollection) return message.reply("Antijoin is already enabled!");
            antijoin.set(message.guild.id, []);
            message.reply("Turned on antijoin system.");
        } else if(query === "off") {
            if(!getCollection) return message.reply("Antijoin is already disabled!");
            antijoin.delete(message.guild.id);
            message.reply("Turned off antijoin system.")
        }
        //  else if(query === "list") {
        //     if(!getCollection) return message.reply("Antijoin is disabled!");
        //     message.reply(`Kicked Members: ${getCollection.map((value) => {
        //         return `${value.tag} (${value.id})`
        //     })}`)
        // }
    }
}
