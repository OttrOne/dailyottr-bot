const mongoose = require('mongoose')
const { reqString } = require('@schemas/types')

const membercountSchema = mongoose.Schema({

    guild: reqString,
    channels: [
      {
        channelId: reqString,
        channelPrefix: reqString,
        roleId: String
      }
    ]
  })

module.exports = mongoose.model('membercount-config', membercountSchema)
