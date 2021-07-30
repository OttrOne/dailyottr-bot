require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const poll = require('./poll')
const mongo = require('./mongo')
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

    console.log('\n==== Loading commands ====')

    const cmdBaseFile = 'command.js';
    const cmdBase = require(`./commands/${cmdBaseFile}`);

    // recursively read directory for commands
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== cmdBaseFile) {
                const option = require(path.join(__dirname, dir, file))
                // call the command
                cmdBase(option)
            }
        }
    }

    readCommands('commands')

    console.log('==== Commands loaded ====\n')
    cmdBase.listen(client)

    poll(client);
    //welcome(client);
    console.log(`ready.`)
});

client.login(process.env.TOKEN);
