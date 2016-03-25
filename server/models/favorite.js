import Mongoose, {Schema} from 'mongoose'
import ShortId from 'mongoose-shortid-nodeps'
import Timestamps from 'mongoose-timestamp'

let Favorite = new Schema({
  id: { type: ShortId, index: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  url: { type: String }
})

Job.plugin(Timestamps)

Job.pre('save', function (next) {
  Mongoose.models['Favorite'].find({
    name: this.name,
    type: this.type
  }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results > 0) return next(new Error('Favorite already exists'))
    next()
  })
})

export default Mongoose.model('Favorite', Favorite)
