const { updateChannels } = require('@mods/member-count')
module.exports = {
    name: 'mcupdate',
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    description: 'Manually update member counts.',
    category: 'MemberCount',
    callback: async (message, arguments, text) => {
        await updateChannels(message.guild)
    },
}
