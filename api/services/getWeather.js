const axios = require('axios')
module.exports = async () => {
  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          id: '4560349',
          APPID: '75dc7318863aad923d9f3c60def26dd1',
          units: 'imperial',
        },
      }
    )
    return response.data
  } catch (err) {
    console.error(err)
  }
}
