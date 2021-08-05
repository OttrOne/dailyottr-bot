require('module-alias/register')
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client);
const mongo = require('@util/mongo')
const commandHandler = require('@util/commands')
const modHandler = require('@util/mods')

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
    await mongo().then(mongoose => {
        try {
            console.log(`Successfully connected to mongodb`)
        } finally {
            mongoose.connection.close()
        }
    })
    commandHandler.load()
    modHandler.load(client)
    commandHandler.listen(client)
    console.log(`ready.`)
});

client.login(process.env.TOKEN);
