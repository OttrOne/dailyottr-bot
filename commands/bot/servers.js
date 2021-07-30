module.exports = {
    aliases: 'servers',
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.client.guilds.cache.forEach((guild) => {
            message.channel.send(
                `Bot inside ${guild.name} with a total of ${guild.memberCount} members.`
            )
        })
    },
}
