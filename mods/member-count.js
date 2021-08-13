const mongo = require('@util/mongo')
const membercountSchema = require('@schemas/membercount-schema')
const {Discord, MessageEmbed, Client} = require('discord.js');
const cache = {}
const { Task, addTask} = require('@util/scheduler')

/**
 * Update all configured channels from cache
 * @param {*} Context to extract guild from
 * @returns false if didnt find channel
 */
const updateChannel = async (guild) => {

    if(!cache[guild.id]) {
        console.log("not chached")

        const result = await membercountSchema.findOne({ guild: guild.id })
        if(!result) return;
        cache[guild.id] = result.channels
    }
    if(!cache[guild.id]) {
        cache[guild.id] = []
    }
    for(chn of cache[guild.id]) {
        const channel = guild.channels.cache.get(chn.channelId)
        if(!channel) return false; // didn't find channel

        let count = guild.memberCount.toLocaleString()
        if(chn.roleId) {
            const role = guild.roles.cache.get(chn.roleId)
            if(role) {
                count = role.members.size.toLocaleString()
            }
        }
        console.log(`Set ${chn.channelPrefix} ${count} for channel ${chn.channelId} on Guild ${guild.id}`)
        channel.setName(`${chn.channelPrefix} ${count}`).catch(error => {

            console.error('Failed to delete the message:', error);
        })
    }
}
/**
 * Expose listeners
 * @param {Client} client
 */
module.exports = (client) => {

    client.guilds.cache.forEach((guild) => {

        const updateCounter = new Task(`updateCounter-${guild.id}`,(context) => {
            guild = context[0];
            updateChannel(guild)
            console.log(guild.name)
        }, 5*60*1000, undefined, guild)
        addTask(updateCounter)
        console.log(guild.name)
    })
}
/**
 * Utility to update the channels
 * @param {*} context
 */
module.exports.updateChannels = async (guild) => { updateChannel(guild) }
/**
 * Utility to remove the channel by id (removes all if with same id if necessary)
 * @param {*} message
 * @param {String} channelId
 */
module.exports.removeChannel = async (message, channelId) => {


    await membercountSchema.findOneAndUpdate(
        { guild: message.guild.id, },
        {
            guild: message.guild.id,
            $pull: { channels: { channelId: channelId } }
        },
        { multi: true }
    )
    // empty cache to force loading from database
    delete cache[message.guild.id];
    updateChannel(message.guild)
}
/**
 * Method to list all channels that are registered for counting members/roles
 *
 * It tries to load the channels from the cache before accessing the remote database.
 * After the list is complete channels get loaded from cache and printed with the
 * attached role
 *
 * @param Message message
 */
module.exports.listChannels = async (message) => {
    const { guild } = message

    // check if in cache. if not -> retrieve from database
    if(!cache[guild.id]) {
        console.log("not chached")

        const result = await membercountSchema.findOne({ guild: guild.id })
        if(!result) return;
        cache[guild.id] = result.channels
    }

    if(!cache[guild.id]) {
        message.reply(`There are no MemberCount channels configured.`)
        return;
    }

    let reply = ''
    let count = 0;

    const embed = new MessageEmbed()
    .setTitle(`MemberCount channels`)
    .setColor('#0099FF')
    .setTimestamp()

    // iterate over every channel from cache
    for(chn of cache[guild.id]) {

        // check if channel and role (still) exist
        const channel = message.guild.channels.cache.get(chn.channelId)
        const role = message.guild.roles.cache.get(chn.roleId)
        if(!channel) continue;

        // set rolename to Everyone or unknown if the field is empty
        rolename = role ? `\`${role.name}\`` : '`Everyone` or `Unknown`';

        reply += `Channel \`${channel.name}\` is attached to role ${rolename}\n`
        ++count;
    }
    if(count === 0) {
        message.channel.send(`There are no channels set up for this Server.`)
        return;
    }
    embed.setDescription(reply)

    message.channel.send(embed)
}

/**
 * Adds channel to listeners
 * @param {*} message
 * @param {String} targetChannel channel id of the target channel
 * @param {String} channelPrefix text prefix to put before number
 */
module.exports.addChannel = async (message, targetChannel, channelPrefix = 'Member:') => {

    const channel = message.guild.channels.cache.get(targetChannel)
    if(!channel) {
        message.reply(`First argument has to be a valid voice channel.`)
    }

    role = message.mentions.roles.first()
    role = role ? role.id : undefined


    const result = await membercountSchema.findOneAndUpdate(
        {
            guild: message.guild.id,
        },
        {
            guild: message.guild.id,
            $push: { channels: { channelId: channel.id, channelPrefix: channelPrefix, roleId: role } }
        },
        {
            upsert: true,
        }
    )

    // empty cache to force loading from database
    delete cache[message.guild.id];
    updateChannel(message.guild)
}
