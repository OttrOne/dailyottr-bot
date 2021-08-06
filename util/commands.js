const path = require('path');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

/**
 *
 */
class CommandHandler {

  /**
   *
   * @param Client client
   * @param string dir
   */
  constructor(client, dir, prefix = '!') {

    this.client = client;
    this.dir = dir;
    this.prefix = prefix
    this.commands = new Map()

    this.load()
    this._listen()
  }

  /**
   *
   * @param array permissions
   */
  _validatePermissions(permissions) {
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

  /**
   *
   * @param directory commandOptions
   */
  _register(commandOptions) {

    let {
      name,
      aliases = [],
      permissions = [],
    } = commandOptions

    if(typeof aliases === 'string') aliases = [aliases]

    //console.log(`registered command "${name}"`)

    // ensure permissions are set and all valid
    if(permissions.length) {
      if(typeof permissions === 'string') permissions = [permissions]
      this._validatePermissions(permissions)
    }

    this.commands.set(name, {
      ...commandOptions, // object destructoring
      aliases,
      permissions
    })
  }

  /**
   *
   * @param string dir
   */
  _load(dir) {
    let count = 0;
    // recursively read directory for commands
    const files = fs.readdirSync(path.join(__dirname, dir))
    for(const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        count += this._load(path.join(dir, file))
      } else {
        const option = require(path.join(__dirname, dir, file))
        // call the command
        this._register(option)
        ++count;
      }
    }
    return count
  }

  _help(message) {
    let reply = ''

    let categorized = {}
    let uncategorized = []

    // how to print each command
    const printCommandList = (commandlist) => {
        let temp = ''
        for (const command of commandlist) {
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const description = command.description ? `, ${command.description}` : ''
            const aliases = command.aliases.length ? `, aliases: \`${this.prefix}${command.aliases.join(`\`, \`${this.prefix}`)}\`` : ''
            temp += `\`${this.prefix}${command.name}${args}\`${aliases}${description}\n`
        }
        return temp;
    }

    for (const [name, command] of this.commands.entries()) {

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
  }

  /**
   *
   */
  _listen() {
    this.client.on('message', message => {
      const { member, content, guild } = message;

      // split command on spaces
      const args = content.split(/[ ]+/)

      // get the command name
      let cmd = args.shift().toLowerCase()

      if (cmd.startsWith(this.prefix)) {

        let command = undefined

        cmd = cmd.replace(this.prefix, '');

        if(cmd === 'help') {
          this._help(message)
          return;
        }

        // find the right command to call
        this.commands.forEach((item) => {

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
        if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
          message.reply(`Incorrect usage! Use \`${this.prefix}${cmd} ${expectedArgs}\``)
          return;
        }

        // handle command
        callback(message, args, args.join(' '))
      }
    })
  }

  /**
   *
   */
  load() {
    console.log('\nStarting up CommandHandler')
    const count = this._load(this.dir)
    console.log(`Done. ${count} Commands loaded\n`)
  }

  getCommands() {
    return new Map(this.commands)
  }
}

module.exports.CommandHandler = CommandHandler
