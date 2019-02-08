const mongoose = require('mongoose')
const { Schema } = mongoose

const kiosk = new Schema(
  {
    addressStreet: String,
    addressZipCode: String,
    bikesAvailable: Number,
    docksAvailable: Number,
    name: String,
    latitude: Number,
    longitude: Number,
    kioskId: Number,
    weather: { type: Schema.Types.ObjectId, ref: 'weather' },
  },

  { timestamps: { createdAt: 'at' } }
)

mongoose.model('kiosk', kiosk)
