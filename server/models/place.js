const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

const Place = new Mongoose.Schema({
  id: { type: String, index: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  message: { type: String },
  place: {
    id: { type: String },
    name: { type: String },
    type: { type: String, default: 'Google' }
  },
  visitor: {
    message: { type: String },
    name: { type: String, required: true }
  },
  isVisitor: { type: Boolean, default: true },
  __v: { type: Number, select: false }
})

Place.plugin(Timestamps)

module.exports = Mongoose.model('Place', Place)
