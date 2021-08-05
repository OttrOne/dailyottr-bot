const { prefix } = require('@root/settings.json');
const path = require('path');
const fs = require('fs');

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS_AND_STICKERS',
    'USE_SLASH_COMMANDS',
    'REQUEST_TO_SPEAK',
    'MANAGE_THREADS',
    'USE_PUBLIC_THREADS',
    'USE_PRIVATE_THREADS',
    'USE_EXTERNAL_STICKERS'
  ]

  for(const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission "${permission}"`)
    }
  }
}

const allCommands = new Map()

class CommandHandler {

  constructor(client, dir) {

  }
}

module.exports.register = (commandOptions) => {
  let {
    name,
    aliases = [],
    permissions = [],
  } = commandOptions

  if(typeof aliases === 'string') aliases = [aliases]

  console.log(`registered command "${name}"`)

  // ensure permissions are set and all valid
  if(permissions.length) {
    if(typeof permissions === 'string') permissions = [permissions]
    validatePermissions(permissions)
  }

  allCommands.set(name, {
    ...commandOptions, // object destructoring
    aliases,
    permissions
  })
}

module.exports.load = (client) => {
  console.log('\n==== Loading commands ====')
  let count = 0;
  // recursively read directory for commands
  const readCommands = dir => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for(const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
        } else {
            const option = require(path.join(__dirname, dir, file))
            // call the command
            this.register(option)
            ++count;
        }
    }
  }
  readCommands('../commands')
  console.log(`==== ${count} Commands loaded ====\n`)
}

module.exports.getCommands = () => {
  return new Map(allCommands)
}

module.exports.listen = (client) => {
  client.on('message', message => {
    const { member, content, guild } = message;

    // split command on spaces
    const arguments = content.split(/[ ]+/)

    // get the command name
    let cmd = arguments.shift().toLowerCase()

    if (cmd.startsWith(prefix)) {

      let command = undefined

      cmd = cmd.replace(prefix, '');
      // get command from command name (first alias)
      //const command = allCommands.find((item) => item.name === 'b')
      allCommands.forEach((item) => {

        if(item.name === cmd || item.aliases.includes(cmd)) {
          command = item
          return;
        }
      })
      if (!command) return; // return if not found

      // default values for commands
      const {
        permissions,
        permissionError = 'You don\'t have permission to run this command.',
        requiredRoles = [],
        minArgs = 0,
        maxArgs = null,
        expectedArgs = '',
        callback
      } = command;

      // check if user has permission
      for (const permission of permissions) {
        if (!member.hasPermission(permission)) {
          message.reply(permissionError)
          return;
        }
      }

      // check if user has required roles or is administrator
      for (const roleName of requiredRoles) {
        const role = guild.roles.cache.find(role => role.name === roleName)

        if ((!role || !member.roles.cache.has(role.id)) && !member.hasPermission('ADMINISTRATOR')) {
          message.reply(`You must have the "${roleName}" role to use this command.`);
          return;
        }
      }

      // check number of arguments
      if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
        message.reply(`Incorrect usage! Use \`${prefix}${cmd} ${expectedArgs}\``)
        return;
      }

      // handle command
      callback(message, arguments, arguments.join(' '))
    }
  })
}
