const { audit } = require('@util/audit')
module.exports = {
    name: 'otty',
    aliases: ['auth'],
    minArgs: 1,
    maxArgs: 1,
    requiredRoles: ['Otty'],
    expectedArgs: '<usertag>',
    callback: (message, arguments, text) => {

        const user = message.mentions.users.first();
        if (user) {
            if (user.bot) return;

            const role = message.guild.roles.cache.get(process.env.ROLEID)
            const member = message.guild.member(user);
            member.roles.add(process.env.ROLEID)

            audit(message, `${message.member.user} added role ${role} to user ${user}`)
        }
    },
}
