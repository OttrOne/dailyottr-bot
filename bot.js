require('module-alias/register')
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client);
const mongo = require('@util/mongo')
const { CommandHandler } = require('@util/commands')
const { ModLoader } = require('@util/mods')

client.on('ready', async () => {

    console.log('\x1b[36m%s\x1b[0m', `Logged in as ${client.user.tag}!`)
    await mongo().then(mongoose => {
        try {
            console.log('\x1b[32m%s\x1b[0m', `Successfully connected to mongodb`)
        } finally {
            mongoose.connection.close()
        }
    })
    const ch = new CommandHandler(client, '../commands/')
    const ml = new ModLoader(client, '../mods/')

    console.log('\x1b[32m%s\x1b[0m', `ready.`)
});

client.login(process.env.TOKEN);
