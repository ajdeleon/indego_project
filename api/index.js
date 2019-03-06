const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('./models/Kiosk')
require('./models/Weather')
require('./models/CurrentKiosk')

const app = new express()

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(
  'mongodb://mongodb:27017/indego',
  { useNewUrlParser: true, reconnectTries: 60, reconnectInterval: 1000 },
  err => {
    if (err) console.log(err)
    console.log('Connected to mongo')
  }
)

app.get('/', (req, res) => {
  res.send('Indego')
})

//require('./routes/testRoutes')(app)
require('./routes/kioskRoutes')(app)
require('./routes/weatherRoutes')(app)
require('./services/updateDatabase.js')()

const port = 4000
app
  .listen(port, () => {
    console.log(`Express listening on port ${port}`)
  })
  .on('error', console.log)

module.exports = app
