const https = require('https')
// const axios = require('axios')
// module.exports = async () => {
//   try {
//     const response = await axios.get(
//       'https://www.rideindego.com/stations/json/'
//     )
//     console.log(response.data)
//   } catch (err) {
//     console.error(err.message)
//   }
// }
// TODO Figure out why axios is returning `incorrect header check`
// https works fine for now

module.exports = () => {
  return new Promise((resolve, reject) => {
    https
      .get('https://www.rideindego.com/stations/json/', res => {
        let data = ''
        let cleanedData = ''

        res.on('data', chunk => {
          data += chunk
        })

        res.on('end', () => {
          try {
            data = JSON.parse(data)
            cleanedData = data.features.map(({ properties }) => {
              return { ...properties }
            })
          } catch (err) {
            reject(err)
          }

          resolve(cleanedData)
          // console.log(cleanedData[0])
        })
      })
      .on('error', err => {
        console.log('Error: ' + err.message)
        return err
      })
  })
}
