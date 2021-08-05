const commandHandler = require('@util/commands')
const { prefix } = require('@root/settings.json');
const { MessageEmbed } = require('discord.js');
const disbut = require("discord-buttons");
module.exports = {
    name: 'help',
    aliases: ['h'],
    maxArgs: 1,
    description: 'List of commands.',
    category: 'intern',
    callback: (message, arguments, text) => {
        let reply = ''
        const commands = commandHandler.getCommands()
        let aliases = []

        let categorized = {}
        let uncategorized = []

        // how to print each command
        const printCommandList = (commandlist) => {
            let temp = ''
            for (const command of commandlist) {
                const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
                const description = command.description ? `, ${command.description}` : ''
                const aliases = command.aliases.length ? `, aliases: \`${prefix}${command.aliases.join(`\`, \`${prefix}`)}\`` : ''
                temp += `\`${prefix}${command.name}${args}\`${aliases}${description}\n`
            }
            return temp;
        }

        for (const [name, command] of commands.entries()) {

            // check for permissions
            if(command.permissions) {
                let hasPermission = true
                for (const permission of command.permissions) {
                    if (!message.member.hasPermission(permission)) {
                        hasPermission = false;
                        break;
                    }
                }
                if (!hasPermission) continue;
            }

            if(command.category) {
                (categorized[command.category] = categorized[command.category] || []).push(command);
            } else {
                uncategorized.push(command)
            }
        }

        // print categorized by category
        for (const command in categorized) {

            reply += `**${command}:**\n`
            reply += `${printCommandList(categorized[command])}\n`
        }
        // print uncategorized
        reply += `**Uncategorized:**\n`
        reply += printCommandList(uncategorized)

        const embed = new MessageEmbed()
            .setColor('#00AAFF')
            .setTitle('Supported Commands')
            .setDescription(reply)
        message.channel.send(embed)

        let button = new disbut.MessageButton()
        .setLabel("Activate my Awboi")
        .setID("awboiActivate")
        .setStyle("green");

        let button2 = new disbut.MessageButton()
        .setStyle('url')
        .setURL('https://npmjs.com/discord-buttons')
        .setLabel('Connect discord on the website first !');

        message.channel.send("Awboi activation :3", { buttons: [button, button2]});
    }
}
