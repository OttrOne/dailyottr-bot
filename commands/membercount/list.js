const { listChannels } = require('@mods/member-count')
module.exports = {
    name: 'mclist',
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    description: 'List of MemberCount channels.',
    category: 'MemberCount',
    callback: async (message, arguments, text) => {
        await listChannels(message)
    },
}
