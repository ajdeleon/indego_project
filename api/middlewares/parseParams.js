module.exports = (req, res, next) => {
  const { at, to, from, frequency } = req.query
  res.locals.filter = {}
  if (at) {
    const dateMinusOneHour = new Date(at)
    dateMinusOneHour.setHours(dateMinusOneHour.getHours() - 1)

    res.locals.filter.at = {
      $gte: new Date(dateMinusOneHour),
      $lt: new Date(at),
    }
  }

  if (from && to) {
    res.locals.filter.at = {
      $gte: new Date(from),
      $lt: new Date(to),
    }
  }

  next()
}
