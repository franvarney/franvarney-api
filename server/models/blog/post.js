import Mongoose, {Schema} from 'mongoose'
import Timestamps from 'mongoose-timestamp'

let Post = new Schema({
  title: { type: String, index: true, required: true },
  slug: { type: String, index: true, required: true },
  image: { type: String },
  caption: { type: String },
  content: { type: String, required: true },
  tags: { type: Array, index: true, default: [] }
})

Post.plugin(Timestamps)

Post.pre('save', function (next) {
  Mongoose.models['Post'].find({
    slug: this.slug
  }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results.length > 0) return next(new Error('Post already exists'))
    next()
  })
})

export default Mongoose.model('Post', Post)
