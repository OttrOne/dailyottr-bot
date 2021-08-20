const mongoose = require('mongoose')
const { reqString } = require('@schemas/types')

const configSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
})

module.exports = mongoose.model('dailyotter-channels', configSchema);
