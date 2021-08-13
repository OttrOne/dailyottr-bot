const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      {
          keepAlive: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
    })
    return mongoose;
}
