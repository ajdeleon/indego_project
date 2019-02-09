const mongoose = require('mongoose')
const Weather = require('../models/Weather.js')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()

const mongoObjectId = mongoose.Types.ObjectId()

chai.use(chaiHttp)

describe('/GET weather/:id', () => {
  it('should get a weather document of the specified id', done => {
    chai
      .request(server)
      .get('/weather/5c59c1118df150ad27a8688b')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('should return error message when no document is found', done => {
    chai
      .request(server)
      .get(`/weather/${mongoObjectId}`)
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.be.a('object')
        res.body.should.have.property('error').eql('no suitable data available')
        done()
      })
  })

  it('should return 422 error when invalid ObjectId is provided', done => {
    chai
      .request(server)
      .get('/weather/testtest')
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have
          .property('error')
          .eql('id is not a valid mongo ObjectId')
        done()
      })
  })

  describe('/POST weather', () => {
    it('should post a new weather document', done => {
      // sample weather object from openweathermap.org/current
      const weather = {
        coord: { lon: -122.09, lat: 37.39 },
        sys: {
          type: 3,
          id: 168940,
          message: 0.0297,
          country: 'US',
          sunrise: 1427723751,
          sunset: 1427768967,
        },
        weather: [
          { id: 800, main: 'Clear', description: 'Sky is Clear', icon: '01n' },
        ],
        base: 'stations',
        main: {
          temp: 285.68,
          humidity: 74,
          pressure: 1016.8,
          temp_min: 284.82,
          temp_max: 286.48,
        },
        wind: { speed: 0.96, deg: 285.001 },
        clouds: { all: 0 },
        dt: 1427700245,
        id: 0,
        name: 'Mountain View',
        cod: 200,
      }

      chai
        .request(server)
        .post('/weather')
        .send(weather)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('temp_min')
          res.body.should.have.property('temp_max')
          res.body.should.have.property('weather')
          res.body.should.have.property('at')
          done()
        })
    })
  })
})
