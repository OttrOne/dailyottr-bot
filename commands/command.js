const { prefix } = require('../settings.json')

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

const allCommands = {}

module.exports = (commandOptions) => {
  let {
    aliases,
    permissions = [],
  } = commandOptions

  if(typeof aliases === 'string') aliases = [aliases]

  console.log(`registered command "${aliases[0]}"`)

  // ensure permissions are set and all valid
  if(permissions.length) {
    if(typeof permissions === 'string') permissions = [permissions]
    validatePermissions(permissions)
  }

  for (const command of aliases) {
    allCommands[command] = {
      ...commandOptions, // object destructoring
      aliases,
      permissions
    }
  }
}

module.exports.listen = (client) => {
  client.on('message', message => {
    const { member, content, guild } = message;

    // split command on spaces
    const arguments = content.split(/[ ]+/)

    // get the command name
    let cmd = arguments.shift().toLowerCase()

    if (cmd.startsWith(prefix)) {

      cmd = cmd.replace(prefix, '');
      // get command from command name (first alias)
      const command = allCommands[cmd]
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
