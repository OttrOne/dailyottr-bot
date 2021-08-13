const { addChannel } = require('@mods/member-count')
module.exports = {
    name: 'mcadd',
    minArgs: 1,
    maxArgs: 3,
    permissions: 'ADMINISTRATOR',
    description: 'Add new channel for member counts',
    category: 'MemberCount',
    expectedArgs: '<ChannelID> <Prefix> <@Group>',
    callback: async (message, arguments, text) => {

        addChannel(message, arguments[0], arguments[1])
    },
}
