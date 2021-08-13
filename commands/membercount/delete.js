const { removeChannel } = require('@mods/member-count')
module.exports = {
    name: 'mcdel',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    expectedArgs: '<ChannelID>',
    description: 'Delete a selected member count channel',
    category: 'MemberCount',
    callback: async (message, arguments, text) => {
        await removeChannel(message, arguments[0])
    },
}
