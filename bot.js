require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const poll = require('./poll')
const mongo = require('./mongo')
const commands = require('./commands/commands')
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

    commands.load()
    commands.listen(client)

    poll(client);
    //welcome(client);
    console.log(`ready.`)
});

client.login(process.env.TOKEN);
