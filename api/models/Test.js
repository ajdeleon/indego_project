const mongoose = require('mongoose')
const { Schema } = mongoose

const testSchema = new Schema({
  first_name: String,
  last_name: String,
})

mongoose.model('test', testSchema)
