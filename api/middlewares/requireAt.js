module.exports = (req, res, next) => {
  // If not then the payload will be the entire collection
  if (!req.query.at) {
    return res.status(400).send('Missing "at" query parameter.')
  }
  next()
}
