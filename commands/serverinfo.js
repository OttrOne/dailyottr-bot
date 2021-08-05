const Discord = require('discord.js');
module.exports = {
    aliases: 'serverinfo',
    maxArgs: 0,
    callback: (message, arguments, text) => {
        const { guild } = message;
        const { name, region, memberCount, owner } = guild;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${name} Discord`)
            .setThumbnail(guild.iconURL())
            .setColor('#F9C03D')
            .setDescription(`This server was created on ${guild.createdAt.toLocaleDateString()}`)
            .addFields(
                {
                    name: 'Region',
                    value: region
                },
                {
                    name: 'Members',
                    value: memberCount
                },
                {
                    name: 'Owner',
                    value: owner.user.tag
                }
            )
        //message.channel.send(embed)
        message.author.send(embed)
    },
}
