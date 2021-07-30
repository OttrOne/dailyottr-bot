const commandHandler = require('./commands')
const { prefix } = require('../settings.json');
module.exports = {
    aliases: ['help', 'h'],
    maxArgs: 1,
    description: 'List of commands.',
    callback: (message, arguments, text) => {
        let reply = 'Supported commands:\n'
        const commands = commandHandler.getCommands()
        let aliases = []

        for (const alias in commands) {
            const command = commands[alias]

            // skip already listed commands by keeping track of aliases
            if(aliases.includes(alias)) continue;
            aliases = aliases.concat(command.aliases)

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
            console.log(command)
            const mainCommand = command.aliases[0];
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const description = command.description ? ` ${command.description}` : ''
            reply += `\`${prefix}${mainCommand}${args}\` ${description}\n`
        }
        message.channel.send(reply)
    }
}
