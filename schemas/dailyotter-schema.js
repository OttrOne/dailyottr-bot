const mongoose = require('mongoose')
const { reqString, reqBoolean } = require('@schemas/types');

const dailyotterSchema = mongoose.Schema({

    guid: reqString,
    title: reqString,
    link: reqString,
    date: {
        type: Date,
        required: true
    },
    imageUrl: reqString,
    reference: reqString,
    sent: reqBoolean
})

module.exports = mongoose.model('dailyotter-pics', dailyotterSchema);
