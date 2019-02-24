module.exports = (req, res, next) => {
  // If not then the payload will be the entire collection
  if (!req.query.at) {
    return res.status(422).send({ error: 'must include "at" parameter' })
  }
  next()
}
