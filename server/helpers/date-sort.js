// 1 = ascending, -1 = descending
module.exports = function (order, a, b) {
  if (!b) ([b, a] = [a, order], order = 1)
  if (order === -1) [b, a] = [a, b]

  if (a.hasOwnProperty('date')) {
    (a = new Date(a.date), b = new Date(b.date))
  }

  if (a.hasOwnProperty('createdAt')) {
    (a = new Date(a.createdAt), b = new Date(b.createdAt))
  }

  if (a < b) return -1
  if (a > b) return 1
  return 0
}
