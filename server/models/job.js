const Mongoose = require('mongoose')
const ShortId = require('mongoose-shortid-nodeps')
const Timestamps = require('mongoose-timestamp')

let Job = new Mongoose.Schema({
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
  tasks: { type: Array, default: [] }
})

Job.plugin(Timestamps)

Job.pre('save', function (next) {
  Mongoose.models['Job'].find({
    employer: this.employer,
    dates: {
      start: this.dates.start,
      end: this.dates.end
    }
  }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results > 0) return next(new Error('Job already exists'))
    return next()
  })
})

module.exports = Mongoose.model('Job', Job)
