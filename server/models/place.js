const Mongoose = require('mongoose')
const Timestamps = require('mongoose-timestamp')

let Place = new Mongoose.Schema({
  location: {
    latitude: { type: Number, required: true }.
    longitude: { type: Number, required: true }
  },
  message: { type: String },
  name: { type: String },
  placeId: { type: String },
  isVisitor: { type: Boolean, default: true }
})

Place.plugin(Timestamps)

module.exports = Mongoose.model('Place', Place)