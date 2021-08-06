const mongo = require('@util/mongo');
const w2gSchema = require('@schemas/w2g-schema');
const disbut = require("discord-buttons");

/**
 * Quick command to save a link and retrieve it via button
 * @requires mongo configured mongodb
 *
 * @author AlexOttr <alex@ottr.one>
 * @version 1.0
 */
module.exports = {
    name: 'w2g',
    minArgs: 0,
    maxArgs: 1,
    requiredRoles: ['Otty'],
    expectedArgs: '[<url>]',
    category: 'OttrSpace',
    description: 'short link for Watch2Gether',
    callback: async (message, arguments, text) => {

        const { channel, guild } = message;

        // set value if parameter present
        if(text) {
            await mongo().then( async (mongoose) => {
                try {
                    await w2gSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        url: text
                    }, {
                        upsert: true,
                        useFindAndModify: false
                    })
                } finally {
                    mongoose.connection.close()
                }
            }).catch((e) => {
                console.log(e)
            })
            channel.send(`Set \`${text}\` as new link for Watch2Gether`)
            return;
        }

        // if parameter (text) empty, get the value from the database
        await mongo().then(async (mongoose) => {
            try {
                const result = await w2gSchema.findOne({ guildId: guild.id })
                // if no entry for current guild found, notify
                if(!result) {
                    message.reply(`Watch2Gether url is not set.`)
                    return;
                }
                let button = new disbut.MessageButton()
                .setStyle('url')
                .setURL(result.url)
                .setLabel('Open Watch2Gether');

                message.channel.send("Here is the set Watch2Gether link:", { buttons: [button]});

            } finally {
                mongoose.connection.close()
            }
        }).catch((e) => {
            console.log(e)
        })
    },
}
