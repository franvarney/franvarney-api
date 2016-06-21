const Mongoose = require('mongoose')
const ShortId = require('mongoose-shortid-nodeps')
const Timestamps = require('mongoose-timestamp')

let Favorite = new Mongoose.Schema({
  id: { type: ShortId, index: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  why: { type: String },
  url: { type: String }
})

Favorite.plugin(Timestamps)

Favorite.pre('save', (next) => {
  Mongoose.models['Favorite'].find({
    name: this.name,
    type: this.type
  }, (err, results) => {
    if (err) return next(new Error(err.message))
    if (results > 0) return next(new Error('Favorite already exists'))
    next()
  })
})

module.exports = Mongoose.model('Favorite', Favorite)
