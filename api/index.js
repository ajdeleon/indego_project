const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('./models/Kiosk')
require('./models/Weather')

const app = new express()
app.use(bodyParser.json())

mongoose.connect(
  'mongodb://localhost:27017/indego',
  { useNewUrlParser: true },
  () => {
    //    console.log('Connected to mongo')
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
app.listen(port, () => {
  console.log(`Express listening on port ${port}`)
})

module.exports = app
