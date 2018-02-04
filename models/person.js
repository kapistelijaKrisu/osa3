const mongoose = require('mongoose')

const url = 'mongodb://tuto:fullstack@ds223268.mlab.com:23268/fullstackweek3'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person