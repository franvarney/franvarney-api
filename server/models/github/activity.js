import Mongoose, {Schema} from 'mongoose'
import Timestamps from 'mongoose-timestamp'

let GithubActivity = new Schema({
  id: { type: String, required: true, index: true },
  type: { type: String, required: true },
  count: { type: String, default: 1 },
  created: { type: String, required: true, index: true }
})

GithubActivity.plugin(Timestamps)

export default Mongoose.model('GithubActivity', GithubActivity)
