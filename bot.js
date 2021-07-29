require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const command = require('./command')
const poll = require('./poll')
//const welcome = require('./welcome')
const settings = require('./settings.json')

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    poll(client);
    //welcome(client);

    command(client, 'servers', (message) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(
                `Bot inside ${guild.name} with a total of ${guild.memberCount} members.`
            )
        })
    })

    command(client, ['cc', 'clear'], async (message) => {

        if(message.member.hasPermission('ADMINISTRATOR')) {

            message.channel.messages.fetch()
            .then(result => {
                message.channel.bulkDelete(result, true)
            })
        }
        else message.reply(`You don't have the permission to run this command!`)
    })

    command(client, 'serverinfo', (message) => {

        const { guild } = message;
        const { name, region, memberCount, owner } = guild;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${name} Discord`)
            .setThumbnail(guild.iconURL())
            .setColor('#F9C03D')
            .setDescription(`This server was created on ${guild.createdAt.toLocaleDateString()}`)
            .addFields(
                {
                    name: 'Region',
                    value: region
                },
                {
                    name: 'Members',
                    value: memberCount
                },
                {
                    name: 'Owner',
                    value: owner.user.tag
                }
            )
        message.channel.send(embed)
    })

    command(client, 'embed', (message) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Hello World')
            .setAuthor(message.author.username)
            .setColor('#00AAFF')
            .addFields(
                {
                    name: 'Test',
                    value: 'Testtext',
                    inline: false
                },
                {
                    name: 'Test2',
                    value: 'Testtext2',
                }
            )
        message.channel.send(embed)
    })

    command(client, 'status', message => {

        const content = message.content.replace(`${settings.prefix}status`, '')

        client.user.setPresence({
            activity: {
                name: content,
                type: 0,
            }
        })
    })

    command(client, ['auth', 'otty'], message => {

        const user = message.mentions.users.first();
        if (user) {
            // find audit channel
            let channel = message.guild.channels.cache.get(process.env.AUDIT_CHANNEL)
            let role = message.guild.roles.cache.get(process.env.ROLEID)

            if(user.bot) {
                message.reply(`Nice try...`);
                return;
            }
            if(!message.member.roles.cache.get(process.env.ROLEID) && !message.member.hasPermission('ADMINISTRATOR')) {
                message.reply(`You're not allowed to use that command!`);
                channel.send(`${message.member.user} tried to add role ${role} to user ${user} but failed due to insufficient rights.`)
                return;
            }
            let member = message.guild.member(user);
            member.roles.add(process.env.ROLEID)

            console.log(`${message.member.user.username} added role ${role.name} to user ${user.username}`)
            channel.send(`${message.member.user} added role ${role} to user ${user}`)
        }

    })
});

client.login(process.env.TOKEN);
