const mongoose = require('mongoose')
const { reqString } = require('@schemas/types')

const auditSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
})

module.exports = mongoose.model('audit-channels', auditSchema);
