const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

let Post = new Mongoose.Schema({
  title: { type: String, index: true, required: true },
  slug: { type: String, index: true, required: true },
  image: { type: String },
  caption: { type: String },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: Array, index: true, default: [] },
  latest: { type: String, index: true, default: true },
  isHtml: { type: Boolean, default: false }
})

Post.plugin(Timestamps)

Post.pre('save', (next) => {
  Mongoose.models['Post'].find({
    slug: this.slug
  }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results.length > 0) return next(new Error('Post already exists'))
    next()
  })
})

module.exports = Mongoose.model('Post', Post)
