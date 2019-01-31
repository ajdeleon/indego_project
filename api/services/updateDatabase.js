const mongoose = require('mongoose')
const cron = require('node-cron')
const Weather = mongoose.model('weather')
const Kiosk = mongoose.model('kiosk')
const getWeather = require('./getWeather')
const getKioskData = require('./getKioskData')

updater = async () => {
  // Add weather data with _id then pass weather._id as field on each kiosk document

  try {
    const weatherData = await getWeather()
    const kioskData = await getKioskData()
    const weather = new Weather({
      _id: new mongoose.Types.ObjectId(),
      ...weatherData.main,
      ...weatherData.weather,
    })
    const kioskDataWithRef = kioskData.map(kiosk => {
      return { ...kiosk, weather: weather._id }
    })

    const weatherResult = await weather.save()
    const kioskResult = await Kiosk.insertMany(kioskDataWithRef, {
      ordered: false,
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = () => {
  // run this job every hour on the 0 minute
  const date = new Date(Date.now())
  cron.schedule('0 * * * *', () => {
    console.log('cron running at: ', date)
    //updater()
  })
}
