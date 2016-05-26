const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

let GithubActivityCache = new Mongoose.Schema({
  date: { type: String, required: true, index: true },
  total: { type: String, default: 0 }
})

GithubActivityCache.plugin(Timestamps)

module.exports = Mongoose.model('GithubActivityCache', GithubActivityCache)
