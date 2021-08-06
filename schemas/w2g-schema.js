const mongoose = require('mongoose')
const { reqString } = require('@schemas/types')

const w2gSchema = mongoose.Schema({
    guildId: reqString,
    url: reqString,
})

module.exports = mongoose.model('w2g-urls', w2gSchema);
