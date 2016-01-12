import Mongoose, {Schema} from 'mongoose'
import Timestamps from 'mongoose-timestamp'

let Post = new Schema({
  title: { type: String, index: true, required: true },
  slug: { type: String, index: true, required: true },
  image: { type: String },
  caption: { type: String },
  content: { type: String, required: true },
  tags: { type: Array, index: true }
})

Post.plugin(Timestamps)

export default Mongoose.model('Post', Post)
