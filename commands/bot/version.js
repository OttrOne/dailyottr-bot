const { version } = require('@root/package.json')

module.exports = { version }

module.exports = {
    name: 'version',
    category: 'LexBot',
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.send(version)
    },
}
