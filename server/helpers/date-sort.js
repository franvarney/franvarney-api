// 1 = ascending, -1 = descending
module.exports = function (order, a, b) {
  if (!b) {
    let temp = order
    a = (b = a, temp)
    order = 1
  }

  if (order === -1) {
    let temp = a
    b = (a = b, temp)
  }

  a = new Date(a.date), b = new Date(b.date)

  if (a < b) return -1
  if (a > b) return 1

  return 0
}
