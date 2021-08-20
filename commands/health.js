const configSchema = require('@schemas/doconf-schema');
const logger = require('@util/logger')
const { version } = require('@root/package.json')
const Parser = require('rss-parser')
const { MessageEmbed } = require(`discord.js`)
const parser = new Parser();

module.exports = {
    name: 'health',
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    category: 'DailyOttr',
    description: 'Health report about the DailyOttr bot. This call is expensive..',
    callback: async (message, arguments, text) => {
        const { guild } = message;

        let rss = channel = embed = false;

        // check feed
        try {
            let feed = await parser.parseURL('https://dailyotter.org/?format=rss')
            if(feed.items.length > 0) rss = true;
        } catch(err) {
            logger.error(`[DailyOtterMod] ${err}`)
        }

        try {
            const channelId = (await configSchema.findOne({ _id: guild.id })).channelId
            const ottChannel = guild.channels.cache.get(channelId)
            if(!ottChannel) throw Error(`Channel not configured or not found on that server.`)

            // set true if all passes
            channel = true;

            const ottEmbed = new MessageEmbed()
            .setTitle(`DailyOtterMod Test`)

            await ottChannel.send(ottEmbed)
            .then(msg => {
                msg.delete({ timeout: 1000 })
            })
            embed = true;

        } catch(err) {
            logger.error(`[DailyOtterMod] ${err}`)
        }
        let checkmsg = `Healthcheck for **DailyOttr Bot** Version \`${version}\`\n\n`

        checkmsg += rss ? '🟢' : '🔴'
        checkmsg += ` Reachability of the Dailyotter.org RSS Feed\n`

        checkmsg += channel ? '🟢' : '🔴'
        checkmsg += ` Channel configured and found on this server\n`

        checkmsg += embed ? '🟢' : '🔴'
        checkmsg += ` Permission to send Embeds in the configured channel`
        message.channel.send(checkmsg)
    },
}
