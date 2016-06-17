const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

let GithubActivity = new Mongoose.Schema({
  id: { type: String, required: true, index: true },
  type: { type: String, required: true },
  count: { type: Number, default: 1 },
  created: { type: String, required: true, index: true }
})

GithubActivity.plugin(Timestamps)

module.exports = Mongoose.model('GithubActivity', GithubActivity)
