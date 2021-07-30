const mongo = require('./mongo');
const auditSchema = require('./schemas/audit-schema');
const settings = require('./settings.json')

const cache = {}

module.exports = {
    audit: async (message, text) => {
        const { guild } = message;
        let data = cache[guild.id]

        // check if audit channel cached
        if(!data) {
            console.log('audit channel not cached, retrieving data.')
            // retrieve data from mongodb if not cached
            await mongo().then(async (mongoose) => {
                try {
                    const result = await auditSchema.findOne({ _id: guild.id })
                    // if no entry for current guild found, notify
                    if(!result) {
                        message.channel.send(`audit channel not set up, please run the command \`${settings.prefix}setaudit\` in the audit channel.`)
                        console.log('audit channel not set, notified.')
                        cache[guild.id] = data = { channelId: message.channel.id }
                        return;
                    }
                    // if found, cache data
                    cache[guild.id] = data = {
                        channelId: result.channelId
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
        }
        // send audit text to channel
        const channel = guild.channels.cache.get(data.channelId)
        channel.send(text)
    },
    clearCache: (message) => {
        delete cache[message.guild.id];
        console.log(`cleared audit cache for ${message.guild.name}`)
    }
}
