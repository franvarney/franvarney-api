module.exports = function (items, fn, done, options) {
  let index = 0

  if (Array.isArray(items)) {
    function next(remaining) {
      if (options && options.breakLoop &&
        remaining instanceof Error) return done(remaining)

      let item = remaining.shift()

      if (!item) return done()

      fn(item, ++index, next.bind(null, remaining))
    }

    next(items.slice())
  } else {
    let keys = Object.keys(items)

    function next(err) {
      if (options && options.breakLoop &&
        err instanceof Error) return done(err)

      let value = items[keys[index]]

      if (!value) return done()

      let object = {}
      object[keys[index]] = value

      fn(object, ++index, next)
    }

    next()
  }
}
