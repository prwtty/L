const { Client, Collection, MessageEmbed, WebhookClient } = require("discord.js");
const fetch = require('node-fetch').default;
const chalk = require('chalk');
require('dotenv').config()

// Settings check
if (!process.env.TOKEN) {
  console.error("Please provide a valid Discord Bot Token.");
  process.exit(1);
} else if (!process.env.PREFIX) {
  console.error("Please provide a prefix for the bot.");
  process.exit(1);
} else if (!process.env.MONGO) {
  console.error("Please provide a mongodb url for the bot.");
  process.exit(1);
} else if (!process.env.OWNER) {
  console.error("Please provide owner id.");
  process.exit(1);
} else if (!process.env.STATUS_TYPE) {
  console.error("Please provide a status type for the bot.")
  process.exit(1);
} else if (!process.env.STATUS) {
  console.error("Please provide a status for the bot.")
  process.exit(1);
} else if (!process.env.OSU_API) {
  console.error("Please provide your osu api key or false.")
  process.exit(1);
} else if (!process.env.REPORT) {
  console.error("Please setup reports.")
  process.exit(1);
} else if (!process.env.CHAT_BOT) {
  console.error("Please provide your monkey dev api key or false.")
  process.exit(1);
} else if (!process.env.WEBHOOK) {
  console.error("Please provide a discord webhook url or false.")
  process.exit(1);
} else if (!process.env.MUSIC) {
  console.error("Please specify true (music on) or false (music off).")
  process.exit(1);
} else if (!process.env.SECRET) {
  console.error("Please provide your client secret.")
  process.exit(1);
} else if (!process.env.RANKIMAG) {
  console.error("Please provide a channel id for rankcard images suggestions.")
  process.exit(1);
} else if (!process.env.PORT) {
  console.error("Please provide a port for the web api.")
  process.exit(1);
}

// Discord.js client
const client = new Client({
    intents: 32767,
    partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION", "GUILD_INVITES"],
});
module.exports = client;

// AntiCrash
require("./assets/logs/anticrash")(client)

// Discord log
const logs = require('discord-logs');
logs(client);

// Global Variables
client.invites = new Collection();
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = process.env;

// Mongoose
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO, {
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => console.log('MongoDB ✔️'));
mongoose.connection.on('disconnected', () => console.log('MongoDB ❌'));
mongoose.connection.on('error', (err) => {
  console.log(err);
  if(process.env.WEBHOOK !== false) {
    const simplydjs = require('simply-djs');

    const embedMongo = new MessageEmbed()
      .setAuthor(`An error occurred | MongoDB`, "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F97%2FDialog-error-round.svg%2F768px-Dialog-error-round.svg.png&f=1&nofb=1")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
      .setTimestamp()

    simplydjs.webhooks(client, {
      chid: data.channel_id, // required
      embed: embedMongo,
    });
  }
});

// Discord-XP
const Levels = require("discord-xp");

Levels.setURL(process.env.MONGO);

// DB Ark.db
const { MongoDB, Database } = require("ark.db");

let db_mongo_stuff;
if(process.env.NEWMONGO) {
  db_mongo_stuff =  process.env.NEWMONGO
} else {
  db_mongo_stuff = process.env.MONGO
}

client.db_json = new Database();
client.db_mongo = new MongoDB(db_mongo_stuff, "ark.db");

// DB Beta.mdb
const db_mongo_quick = require('@prince527/beta.mdb')

client.mongo_quick = new db_mongo_quick.Database(process.env.MONGO, { keepAliveInitialDelay: 300000 })

// WebHook (this is for errors)
if(process.env.WEBHOOK !== false) {
  client.webhookError = new WebhookClient({ url: process.env.WEBHOOK });
}

// Nuggies
const Nuggies = require('nuggies');

Nuggies.handleInteractions(client);
Nuggies.connect(process.env.MONGO);

// Schema
const modlogsSchema = require('./models/modlogs');
const prefixSchema = require('./models/prefix');
const eco = require('./models/economy');

// Prefix
client.prefix = async function(message) {
  let custom;
  const data = await prefixSchema.findOne({
      Guild: message.guild.id
    })
    .catch(err => console.log(err))
  if (data) {
    custom = data.Prefix;
  } else {
    custom = process.env.PREFIX;
  }
  return custom;
}

// Economy
client.bal = (id, coins) => new Promise(async ful => {
  const data = await eco.findOne({
    id
  });
  if (!data) return ful[0];
  ful(data.coins);
})

client.add = (id, coins) => {
  eco.findOne({
    id
  }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins += coins;
    } else {
      data = new eco({
        id,
        coins
      });
    }
    data.save();
  })
}

client.rmv = (id, coins) => {
  eco.findOne({
    id
  }, async (err, data) => {
    if (err) throw err;
    if (data) {
      data.coins -= coins;
    } else {
      data = new eco({
        id,
        coins: -coins
      });
    }
    data.save();
  })
}

// Distube
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const DisTube = require('distube');

const player = new DisTube.DisTube(client, {
  searchSongs: 10,
	searchCooldown: 30,
	leaveOnEmpty: true,
	emptyCooldown: 0,
	leaveOnFinish: true,
	leaveOnStop: true,
  youtubeDL: true,
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

player
  .on("playSong", (queue, song) => {
    console.log(chalk.green(`[Music] "${song.name}" on ${queue.clientMember.guild.name} has started`));
    queue.textChannel.send({ embeds: [
      new MessageEmbed()
          .setDescription(`▶ **|** Started playing: **[${song.name}](${song.url})**`)
          .setThumbnail(`${song.thumbnail}`)
          .setColor("#5400FF")
    ]});
  })
  .on("addSong", (queue, song) => queue.textChannel.send({ embeds: [
    new MessageEmbed()
        .setDescription(`✅ **|** **[${song.name}](${song.url})** has been added to the queue`)
        .setThumbnail(`${song.thumbnail}`)
        .setColor("#5400FF")
  ]}))
  .on("playList", (message, queue, playlist, song) => message.channel.send({ embeds: [
    new MessageEmbed()
        .setDescription(`✅ **|** All videos in **[${playlist.name}](${playlist.url})** playlist has been added to the queue`)
        .setThumbnail(playlist.thumbnail)
        .setColor("#5400FF")
  ]}))
  .on("addList", (queue, playlist) => queue.textChannel.send({ embeds: [
    new MessageEmbed()
        .setDescription(`Adding all videos in **[${playlist.name}](${playlist.url})** playlist, please wait...`)
        .setThumbnail(playlist.thumbnail)
        .setColor("#5400FF")
  ]}))
  .on("searchResult", (message, results) => {
    let i = 0;
    message.channel.send({ embeds: [
        new MessageEmbed()
            .setTitle("Select a song!")
            .setDescription(`\`\`\`${results.map(song => `${++i} - ${song.name}`).join("\n")}\`\`\`` + "\nPlease select one of the results ranging from **\`1-10\`**")
            .setAuthor("Music Selection", message.client.user.displayAvatarURL())
            .setColor("#5400FF")
    ]})})
  .on("searchCancel", (message) => {
    message.channel.send({ embeds: [
        new MessageEmbed()
            .setDescription("None or invalid value entered, the music selection has canceled")
            .setColor("YELLOW")
    ]})
  })
  .on("error", (channel, error) => {
    console.error(error)
    channel.send({ embeds: [
        new MessageEmbed()
            .setColor("RED")
            .setDescription(`An error occurred while playing music, reason: **\`${error.slice(0, 1940)}\`**`)
    ]})})
  .on("noRelated", (queue) => {
      queue.textChannel.send({ embeds: [
        new MessageEmbed()
            .setDescription("Can't find related video to play. Stop playing music.")
            .setColor("RED")
      ]})
  })
  .on("initQueue", (queue) => {
    queue.autoplay = false;
    queue.volume = 50;
  })
  .on("finish", async(queue) => {
    console.log(chalk.green(`[Music] Music has stopped on ${queue.clientMember.guild.name}`));
    queue.textChannel.send({ embeds: [
        new MessageEmbed()
            .setDescription(`⏹ **|** The music has ended, use **\`play\`** to play some music`)
            .setColor("5400FF")
    ]});
  })
  .on("empty", (queue) => {
    queue.textChannel.send({ embeds: [
        new MessageEmbed()
            .setTitle("Music Player Stopped")
            .setDescription("⏹ **|** Everyone has left from the voice channel. To save resources, the queue has been deleted.")
            .setColor("YELLOW")
    ]})
  })
  .on("searchInvalidAnswer", (message) => message.channel.send({ embeds: [
    new MessageEmbed()
        .setDescription(`You answered an invalid number!`)
        .setColor("RED")
  ]}))
  .on("searchDone", () => {})
  .on("searchNoResult", (message, query) => message.channel.send({ embeds: [
    new MessageEmbed()
      .setDescription(`No result found for ${query}!`)
      .setColor("RED")
  ]}));

client.player = player;

// Initializing the project
require("./handler")(client);

// Login to bot account
client.login(client.config.TOKEN);
