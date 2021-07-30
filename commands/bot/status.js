module.exports = {
    aliases: 'status',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<text>',
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {
        message.client.user.setPresence({
            activity: {
                name: arguments[0],
                type: 0,
            }
        })
    },
}
