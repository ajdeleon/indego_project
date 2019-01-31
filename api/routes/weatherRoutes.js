const mongoose = require('mongoose')
const Weather = mongoose.model('weather')

module.exports = app => {
  app.get('/weather', async (req, res) => {
    try {
      const result = Weather.find({ id: 4560349 })
      res.send('Hello')
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/weather', async (req, res) => {
    const weather = new Weather({
      ...req.body,
    })

    try {
      const result = await weather.save()
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  // app.post('/testMany', async (req, res) => {
  //   try {
  //     const result = await Test.insertMany(req.body, { ordered: false })
  //     res.send(result)
  //   } catch (err) {
  //     res.status(422).send(err)
  //   }
  // })
}
