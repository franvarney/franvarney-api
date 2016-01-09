import Mongoose, {Schema} from 'mongoose'
import Timestamps from 'mongoose-timestamp'

let GithubActivityCache = new Schema({
  date: { type: String, required: true, index: true },
  total: { type: String, default: 0 }
})

GithubActivityCache.plugin(Timestamps)

export default Mongoose.model('GithubActivityCache', GithubActivityCache)
