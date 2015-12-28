import Mongoose, {Schema} from 'mongoose'
import ShortId from 'mongoose-shortid-nodeps'
import Timestamps from 'mongoose-timestamp'

let Job = new Schema({
  id: { type: ShortId, index: true },
  employer: { type: String, required: true },
  location: {
    city: { type: String, default: 'Cincinnati' },
    state: { type: String, default: 'Ohio' }
  },
  dates: {
    start: { type: String, required: true },
    end: { type: String, default: 'Present' }
  },
  title: { type: String, required: true },
  responsibilities: { type: Array, default: [] }
})

Job.plugin(Timestamps)

export default Mongoose.model('Job', Job)
