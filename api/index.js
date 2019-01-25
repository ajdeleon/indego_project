const express = require('express')
const mongoose = require('mongoose')

const app = new express()

mongoose.connect('mongodb://mongodb:27017')

app.get('/', (req, res) => {
  res.send('Hello there')
})

const port = 4000
app.listen(port, () => {
  console.log(`Express listening on port ${port}`)
})
