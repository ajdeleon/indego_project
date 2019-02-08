const mongoose = require('mongoose')
const { Schema } = mongoose

const weatherSchema = new Schema(
  {
    temp: Number,
    pressure: Number,
    humidity: Number,
    temp_min: Number,
    temp_max: Number,
    weather: [{ main: String, description: String }],
  },
  { timestamps: { createdAt: 'at' } }
)

mongoose.model('weather', weatherSchema)
