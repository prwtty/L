const client = require("../index");
const Levels = require('discord-xp');
const db = require('quick.db');

client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
      if(db.has(`xp-${message.guild.id}`)=== false) {
        const randomXp = Math.floor(Math.random() * 9) + 1; //Random amont of XP until the number you want + 1
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
        if (hasLeveledUp) {
            if(db.has(`xp-channel-${message.guild.id}`) === true) {
              const channel = message.guild.channels.cache.get(await db.get(`xp-channel-${message.guild.id}`));
              const user = await Levels.fetch(message.author.id, message.guild.id);
              channel.send(`${message.author} leveled up to ${user.level}! Keep it going!`);
            } else {
              const user = await Levels.fetch(message.author.id, message.guild.id);
              message.channel.send(`${message.author.username} leveled up to ${user.level}! Keep it going!`);
            }
          }
      }
});
