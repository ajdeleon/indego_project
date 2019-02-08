const mongoose = require('mongoose')
const Weather = mongoose.model('weather')

module.exports = app => {
  app.get('/weather/:id', async (req, res) => {
    const id = req.params.id
    try {
      const result = await Weather.findById(id)
      res.send(result)
    } catch (err) {
      res.status(422).send(err.message)
    }
  })

  app.post('/weather', async (req, res) => {
    const weather = new Weather({
      ...req.body,
      ...req.body.main,
    })

    try {
      const result = await weather.save()
      res.send('Weather saved successfully: ' + result)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
