const settings = require('./settings.json')

module.exports = client => {

    // put in one regex to keep order
    const emoteReg = new RegExp('<a:\\w+:\\d+>|<:\\w+:\\d+>|[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]', 'gu')
    const emojiReg = new RegExp('<a:\\w+:\\d+>|<:\\w+:\\d+>', 'g');

    client.on('message', async (message) => {
        if(message.content.startsWith(`${settings.prefix}poll `)) {
            console.log(message.content)
            emojis = message.content.match(emoteReg);

            // delete old message
            await message.delete();
            // find message that was above
            const reactTo = await message.channel.messages.fetch({ limit: 1 })
            // take first message and add reactions
            if(reactTo && reactTo.first()) {
                // filter for emojis known to the server
                emojis.forEach(suspect => {
                    if(suspect.match(emojiReg) && !client.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` == suspect | `<a:${emoji.name}:${emoji.id}>` == suspect)) {
                        return;
                    }
                    setTimeout(() => {
                        reactTo.first().react(suspect)
                    }, 750) // delay, otherwise discord hates you
                });
            }

        }
    })
}
