module.exports = function (days) {
  let today = new Date()
  return new Date(today.valueOf() - (1000 * 60 * 60 * 24 * days))
}
