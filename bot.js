require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const CMD_PREFIX = '!';

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', msg => {
    if (msg.content.startsWith(`${CMD_PREFIX}otty`)) {
        let user = msg.mentions.users.first();
        if (user) {
            // find audit channel
            let channel = msg.guild.channels.cache.get(process.env.AUDIT_CHANNEL)
            let role = msg.guild.roles.cache.get(process.env.ROLEID)

            if(user.bot) {
                msg.reply(`Nice try...`);
                return;
            }
            if(!msg.member.roles.cache.get(process.env.ROLEID)) {
                msg.reply(`You're not allowed to use that command!`);
                channel.send(`${msg.member.user} tried to add role ${role} to user ${user} but failed due to insufficient rights.`)
                return;
            }
            let member = msg.guild.member(user);
            member.roles.add(process.env.ROLEID)

            console.log(`${msg.member.user.username} added role ${role.name} to user ${user.username}`)
            channel.send(`${msg.member.user} added role ${role} to user ${user}`)
        }
    }
})

client.login(process.env.TOKEN);
