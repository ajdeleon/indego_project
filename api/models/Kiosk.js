const mongoose = require('mongoose')
const { Schema } = mongoose

const kiosk = new Schema({
  addressStreet: String,
  addressZipCode: String,
  bikesAvailable: Number,
  docksAvailable: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  kioskId: Number,
})

mongoose.model('kiosk', kiosk)
