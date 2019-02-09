const mongoose = require('mongoose')
const Weather = mongoose.model('weather')

module.exports = app => {
  app.get('/weather/:id', async (req, res) => {
    const id = req.params.id
    try {
      const result = await Weather.findById(id)
      if (result === null) {
        return res.status(404).send({ error: 'no suitable data available' })
      }
      res.send(result)
    } catch (err) {
      res.status(422).send({ error: 'id is not a valid mongo ObjectId' })
    }
  })

  app.post('/weather', async (req, res) => {
    const weather = new Weather({
      ...req.body,
      ...req.body.main,
    })

    try {
      const result = await weather.save()
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
