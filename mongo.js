const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/lexbot?retryWrites=true&w=majority`,
      {
          useNewUrlParser: true,
          useUnifiedTopology: true
    })
    return mongoose;
}
