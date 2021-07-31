require('module-alias/register')
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
//const poll = require('./poll')
const mongo = require('@util/mongo')
const commandHandler = require('@util/commands')
//const welcome = require('./welcome')


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
    commandHandler.listen(client)

    //poll(client);
    //welcome(client);
    console.log(`ready.`)
});

client.login(process.env.TOKEN);
