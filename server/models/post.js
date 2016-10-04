const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

const Post = new Mongoose.Schema({
  title: { type: String, index: true, required: true },
  slug: { type: String, index: true, required: true },
  category: { type: String, required: true },
  image: { type: String },
  caption: { type: String },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: Array, index: true, default: [] },
  isLatest: { type: Boolean, index: true, default: false },
  isHtml: { type: Boolean, default: false },
  isPreview: { type: Boolean, default: true },
  __v: { type: Number, select: false }
})

Post.plugin(Timestamps)

Post.pre('save', (next) => {
  Mongoose.models['Post'].find({ slug: this.slug }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results.length) return next(new Error('Post already exists'))
    return next()
  })
})

module.exports = Mongoose.model('Post', Post)
