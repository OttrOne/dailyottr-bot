const { MessageEmbed } = require('discord.js')
const Parser = require('rss-parser')

const dailyotterSchema = require('@schemas/dailyotter-schema')
const logger = require('@util/logger')
const { Task, addTask} = require('@util/scheduler')

const parser = new Parser();

const fetchOtters = async () => {

    const otters = []

    logger.info(`[DailyOtterMod] Fetch otters`)

    let feed = await parser.parseURL('https://dailyotter.org/?format=rss')
    const picRe = /data-image=\"([a-zA-Z0-9\:\.\%\-\+\/]+)\"/

    for (item of feed.items) {

        let url = picRe.exec(item.content)
        if (url && url[1]) {
            const exists = await dailyotterSchema.find({
                guid: item.guid
            })

            if(exists.length !== 0) return [];
            const otter = {
                guid: item.guid,
                title: item.title,
                date: item.isoDate,
                reference: item.contentSnippet,
                link: item.link,
                imageUrl: url[1],
                sent: false
            }
            const otterSave = dailyotterSchema({
                guid: item.guid,
                title: item.title,
                date: item.isoDate,
                reference: item.contentSnippet,
                link: item.link,
                imageUrl: url[1],
                sent: false
            });
            await otterSave.save(function (err, doc) {
                if(err) {
                    logger.error(err);
                    console.log(doc)
                }
            });
            otters.push(otter)
        }
    }
    return otters;
}
const sendOtter = async (guild, otters) => {
    const channelId = '869974559762284544'
    const channel = guild.channels.cache.get(channelId)

    logger.info(`[DailyOtterMod] Send otters to guild ${guild.name}`)

    if(!channel) {
        logger.error(`[DailyOtterMod] Channel not found on guild ${guild.name}`)
        return;
    }

    const me = guild.me.user

    for (const otter of otters) {
        const otterEmbed = new MessageEmbed()
        .setAuthor(me.username, me.avatarURL())
        .setTitle(otter.title)
        .setImage(otter.imageUrl)
        .setTimestamp(otter.date)
        .setURL(otter.link)
        .setFooter(`Fetched from dailyotter.org - ${otter.reference}`)
        channel.send(otterEmbed)
    }
}

const setToSent = async (otters) => {

    for(otter in otters) {
        await dailyotterSchema.updateOne({
            guid: otter.guid
        }, { sent: true })
    }
}

module.exports = async (client) => {

    //fetchOtters()

    const updateOtters = new Task(`updateOtters`, async (context) => {

        const client = context[0];
        //await fetchOtters()
        const otters = await fetchOtters()
        console.log(otters)
        logger.debug(`[DailyOtterMod] Found ${otters.length} new Otters !`)
        client.guilds.cache.forEach((guild) => {
            sendOtter(guild, otters)
        })

        setToSent(otters)
    }, 10*1000, undefined, client)
    addTask(updateOtters)
    logger.info(`[DailyOtterMod] Add Task to update otters`)
}
