const { sendLast } = require('@mods/dailyotter');
module.exports = {
    name: 'send',
    maxArgs: 1,
    category: 'DailyOttr',
    description: 'Send the last or a limited amount of Otters',
    expectedArgs: '[limit]',
    callback: async (message, arguments, text) => {
        const { guild } = message;
        let [limit] = arguments
        if(!limit) limit = 1
        sendLast(guild, limit);
    },
}
