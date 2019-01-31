const mongoose = require('mongoose')
const Kiosk = mongoose.model('kiosk')

module.exports = async data => {
  const kiosk = new Kiosk({
    ...data,
  })
  try {
    const result = await kiosk.save()
    return result
  } catch (err) {
    return err
  }
}
