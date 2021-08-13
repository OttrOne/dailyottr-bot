const mongo = require('@util/mongo');
const auditSchema = require('@schemas/audit-schema');
const { clearCache } = require('@util/audit');
module.exports = {
    name: 'audit',
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    category: 'LexBot',
    description: 'Set the audit channel to the current channel.',
    callback: async (message, arguments, text) => {
        const { channel, guild } = message;

        // connect to mongodb and add if not exist, if exist -> update
        await auditSchema.findOneAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            channelId: channel.id
        }, {
            upsert: true,
            useFindAndModify: false
        })

        // empty cache for the current guild
        clearCache(message)

        channel.send(`Set ${channel} as new audit channel`)
    },
}
