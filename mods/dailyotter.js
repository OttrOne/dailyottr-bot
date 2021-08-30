const { MessageEmbed } = require('discord.js')
const Parser = require('rss-parser')

const dailyotterSchema = require('@schemas/dailyotter-schema')
const configSchema = require('@schemas/doconf-schema');
const logger = require('@util/logger')
const { Task, addTask} = require('@util/scheduler')

const parser = new Parser();

const fetchOtters = async (save = true, limit = -1, shuffle = false) => {

    logger.info(`[DailyOtterMod] Fetch otters, saving: ${save}`)

    // parse dailyotter blog for pictures
    const feed = await parser.parseURL('https://dailyotter.org/?format=rss')
    const picRe = /data-image=\"([a-zA-Z0-9\:\.\%\-\+\/]+)\"/

    if(shuffle) feed.items.sort(() => Math.random() - 0.5);
    const ottersItems = limit > 0 ? feed.items.slice(feed.items.length - limit) : feed.items;
    const otters = []

    for (item of ottersItems) {

        // check for url in content
        let url = picRe.exec(item.content)
        if (url && url[1]) {

            if(save) {
                // check if existant.
                const exists = await dailyotterSchema.find({
                    guid: item.guid
                }) // TODO findOneAndUpdate?
                if(exists.length !== 0) continue;
            }
            const otter = {
                title: item.title,
                date: item.isoDate,
                reference: item.contentSnippet,
                link: item.link,
                imageUrl: url[1],
            }
            if(save) {
                await dailyotterSchema({
                    guid: item.guid
                }).save(function (err, doc) {
                    if(err) {
                        logger.error(err);
                        console.log(doc)
                    }
                });
            }
            // push to list of new otts
            otters.push(otter)
        }
    }
    // pics from rss are ordered chronologically with newest, first.
    // we want to send it so that the newest one is the last message
    return otters.reverse();
}

const sendOtter = async (guild, otters) => {

    const me = guild.me.user

    try{
        // get channel from mongodb
        const channelId = (await configSchema.findOne({ _id: guild.id })).channelId
        const channel = guild.channels.cache.get(channelId)
        if(!channel) throw Error(`[DailyOtterMod] Channel not found on guild ${guild.name}`);

        for (const otter of otters) {
            const otterEmbed = generateEmbed(me, otter)
            try {
                await channel.send(otterEmbed)
                logger.debug(`[DailyOtterMod] Sent Ott to Server ${guild.name}`)
            } catch (error) {
                logger.error(`[DailyOtterMod] Unable to send Messages in the configured channel on Server ${guild.name}`)
                console.log(error)
            }
        }

    } catch(err) {
        logger.error(err)
        return;
    }
}

/**
 *
 * @param {User} me
 * @param {Otter} otter
 * @returns MessageEmbed
 */
const generateEmbed = (me, otter) => {

    return new MessageEmbed()
    .setAuthor(me.username, me.avatarURL())
    .setTitle(otter.title)
    .setImage(otter.imageUrl)
    .setTimestamp(otter.date)
    .setColor('#F2B749')
    .setURL(otter.link)
    .setFooter(`Fetched from dailyotter.org - ${otter.reference}`)

}

const sendLast = async (guild, limit) => {

    // parse dailyotter blog for pictures

    const otters = await fetchOtters(false, limit, true);
    await sendOtter(guild, otters);
}

module.exports = async (client) => {

    // first execution on startup
    const otters = await fetchOtters()
    logger.debug(`[DailyOtterMod] Found ${otters.length} new Otters !`)
    client.guilds.cache.forEach((guild) => {
        sendOtter(guild, otters)
    })

    const updateOtters = new Task(`updateOtters`, async (context) => {

        const client = context[0];

        const otters = await fetchOtters()
        logger.debug(`[DailyOtterMod] Found ${otters.length} new Otters !`)
        client.guilds.cache.forEach((guild) => {
            sendOtter(guild, otters)
        })
    }, 5*60*60*1000, undefined, client)
    addTask(updateOtters)
    logger.info(`[DailyOtterMod] Add Task to update otters`)
}

module.exports.sendLast = sendLast;
