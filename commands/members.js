module.exports = {
    name: 'members',
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    callback: (message, arguments, text) => {

        const targetRole = message.mentions.roles.first() || null;

        message.guild.members.cache.each(member => {

            if( targetRole !== null && member.roles.cache.has(targetRole.id)) {

                console.log(member.user.tag)

            } else if (targetRole === null) {

                console.log(member.user.tag)
            }
        })

    },
}
