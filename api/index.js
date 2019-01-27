const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('./models/Test')
require('./models/Kiosk')

const app = new express()
app.use(bodyParser.json())

const Test = mongoose.model('test')
const Kiosk = mongoose.model('kiosk')

mongoose.connect(
  'mongodb://localhost:27017/indego',
  () => {
    console.log('Connected to mongo')
  }
)

app.get('/', (req, res) => {
  res.send('Indego')
})

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

const port = 4000
app.listen(port, () => {
  console.log(`Express listening on port ${port}`)
})
