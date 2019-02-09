const mongoose = require('mongoose')
const Weather = require('../models/Weather.js')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()

const mongoObjectId = mongoose.Types.ObjectId()

chai.use(chaiHttp)

describe('/GET stations/', () => {
  it('should return error asking for "at" param', done => {
    chai
      .request(server)
      .get('/stations')
      .end((err, res) => {
        res.should.have.status(422)
        res.body.should.have
          .property('error')
          .eql('must include "at" parameter')
        done()
      })
  })
})

describe('/GET stations?at=1999-01-01T00:00:00Z', () => {
  it('should return an error if no suitable data at timestamp', done => {
    chai
      .request(server)
      .get('/stations?at=1999-01-01T00:00:00Z')
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.be.a('object')
        res.body.should.have.property('error').eql('no suitable data')
        done()
      })
  })
})

describe('/GET stations?at=TIMESTAMP', () => {
  it('should return object with "at" timestamp, station data, and weather', done => {
    chai
      .request(server)
      .get('/stations?at=2019-02-03T04:23:53Z')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.all.keys('at', 'stations', 'weather')
        done()
      })
  })

  describe('/GET stations/:id?from=TIMESTAMP&to=TIMESTAMP', () => {
    const stationId = 3004
    const fromTimestamp = '2019-02-03T02:23:53Z'
    const toTimestamp = '2019-02-04T05:23:53Z'

    it('should return an array of objects', done => {
      chai
        .request(server)
        .get(`/stations/${stationId}?from=${fromTimestamp}&to=${toTimestamp}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('array')
          res.body[0].should.have.all.keys('at', 'station', 'weather')
        })

      done()
    })
  })

  describe('/GET stations?from=TIMESTAMP&to=TIMESTAMP', () => {
    const stationId = 3004
    const fromTimestamp = '1999-01-01T00:00:00Z'
    const toTimestamp = '1999-01-31T00:00:00Z'

    it('should return an error if no suitable data within range', done => {
      chai
        .request(server)
        .get(`/stations/${stationId}?from=${fromTimestamp}&to=${toTimestamp}`)
        .end((err, res) => {
          console.log(res)
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error').eql('no suitable data')
          done()
        })
    })
  })
})
