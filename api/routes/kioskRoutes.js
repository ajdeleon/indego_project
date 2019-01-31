const mongoose = require('mongoose')
const Kiosk = mongoose.model('kiosk')
const Weather = mongoose.model('weather')

module.exports = app => {
  app.get('/kiosk/:id', async (req, res) => {
    const id = req.params.id
    try {
      const kiosk = await Kiosk.find({ kioskId: id })
        .populate('weather')
        .exec((err, results) => {
          if (err) return console.log(err)
          res.send(results)
        })
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.get('/station/:id', async (req, res) => {
    const kioskId = req.params.id
    try {
      const kiosk = await Kiosk.findOne({ kioskId })
      const weather = await Weather.findOne({ _id: kiosk.weather })

      res.send({
        at: weather.at,
        kiosk,
        weather,
      })
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/kiosk', async (req, res) => {
    const kiosk = new Kiosk({
      ...req.body,
    })

    try {
      const result = await kiosk.save()
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/kiosks', async (req, res) => {
    try {
      const result = await Kiosk.insertMany(req.body, { ordered: false })
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
