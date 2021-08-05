const mongo = require('@util/mongo');
const auditSchema = require('@schemas/audit-schema');
const { clearCache } = require('@util/audit');
module.exports = {
    name: 'audit',
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    category: 'intern',
    description: 'Set the Audit channel.',
    callback: async (message, arguments, text) => {
        const { channel, guild } = message;

        // connect to mongodb and add if not exist, if exist -> update
        await mongo().then( async (mongoose) => {
            try {
                await auditSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    channelId: channel.id
                }, {
                    upsert: true,
                    useFindAndModify: false
                })
            } finally {
                mongoose.connection.close()
            }
        })

        // empty cache for the current guild
        clearCache(message)

        channel.send(`Set ${channel} as new audit channel`)
    },
}
