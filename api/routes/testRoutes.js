const mongoose = require('mongoose')
const Test = mongoose.model('test')

module.exports = app => {
  app.post('/test', async (req, res) => {
    const { first_name, last_name } = req.body

    const test = new Test({
      first_name,
      last_name,
    })

    try {
      const result = await test.save()
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/testMany', async (req, res) => {
    try {
      const result = await Test.insertMany(req.body, { ordered: false })
      res.send(result)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
