const mongoose = require('mongoose')
const { reqString, reqBoolean } = require('@schemas/types');

const dailyotterSchema = mongoose.Schema({

    guid: reqString
})

module.exports = mongoose.model('dailyotter-pics', dailyotterSchema);
