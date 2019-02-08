const mongoose = require('mongoose')
const Kiosk = mongoose.model('kiosk')
const Weather = mongoose.model('weather')
const parseParams = require('../middlewares/parseParams')
const requireAt = require('../middlewares/requireAt')

module.exports = app => {
  app.get('/stations', parseParams, requireAt, async (req, res) => {
    try {
      const kiosks = await Kiosk.find(res.locals.filter)
      // const weather = await Weather.findById(kiosks[0].weather)
      const weather = await Weather.find(res.locals.filter)

      if (kiosks.length === 0)
        return res.status(404).send('No data found for this time period')
      res.send({
        at: weather.at,
        kiosks,
        weather,
      })
    } catch (err) {
      res.status(422).send(err.message)
    }
  })

  app.get('/stations/:id', parseParams, async (req, res) => {
    let response
    const kioskId = req.params.id
    try {
      const kiosks = await Kiosk.find({ kioskId, ...res.locals.filter })
      const weather = await Weather.findById(kiosks[0].weather)

      if (kiosks.length === 0)
        return res.status(404).send('No data found for this time period')
      //There is a better way to do this.
      if (req.query.frequency === 'daily') {
        const filteredKiosks = kiosks.filter(kiosk => {
          const stationDate = new Date(kiosk.at)
          return stationDate.getHours() === 12
        })
        return res.send(filteredKiosks)
      }

      if (req.query.to && req.query.from) {
        response = kiosks.map((kiosk, index) => {
          return { at: kiosk.at, station: kiosk, weather }
        })
      } else {
        response = {
          at: weather.at,
          kiosk: [...kiosks],
          weather,
        }
      }
      res.send(response)
    } catch (err) {
      res.status(422).send(err.message)
    }
  })
}
