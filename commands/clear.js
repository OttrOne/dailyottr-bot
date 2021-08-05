const { audit } = require('@util/audit')
module.exports = {
    name: 'clear',
    aliases: ['cc'],
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
        message.channel.messages.fetch({limit: 100})
            .then(result => {
                message.channel.bulkDelete(result, true)
            })
            audit(message, `Channel ${message.channel} emptied by ${message.author}`)
    },
}
