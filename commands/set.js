const configSchema = require('@schemas/doconf-schema');
module.exports = {
    name: 'set',
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    category: 'DailyOttr',
    description: 'Set the text channel where the Bot should post the Otts',
    callback: async (message, arguments, text) => {
        const { channel, guild } = message;

        // connect to mongodb and add if not exist, if exist -> update
        await configSchema.findOneAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            channelId: channel.id
        }, {
            upsert: true
        })

        channel.send(`Set ${channel} as Ott channel !`)
    },
}
