const {expect} = require('code')
const Lab = require('lab')

const DateSort = require('../../server/helpers/date-sort')

const lab = exports.lab = Lab.script()
const {describe, it} = lab

let testArray = []

describe('helpers/date-sort', () => {
  describe('when using default sort order', () => {
    it('sorts in ascending order', (done) => {
      testArray = [
        { date: 'Wed Oct 21 2015' },
        { date: 'Wed Oct 21 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Tue Oct 13 2015' }
      ]

      testArray.sort(DateSort)

      expect(testArray).to.deep.equal([
        { date: 'Tue Oct 13 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Wed Oct 21 2015' },
        { date: 'Wed Oct 21 2015' }
      ])

      return done()
    })
  })

  describe('when passing in 1', () => {
    it('sorts in ascending order', (done) => {
      testArray = [
        { date: 'Wed Oct 21 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Tue Oct 13 2015' }
      ]

      testArray.sort(DateSort.bind(null, 1))

      expect(testArray).to.deep.equal([
        { date: 'Tue Oct 13 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Wed Oct 21 2015' }
      ])

      return done()
    })
  })

  describe('when passing in -1', () => {
    it('sorts in descending order', (done) => {
      testArray = [
        { date: 'Fri Oct 23 2015' },
        { date: 'Tue Oct 13 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Wed Oct 21 2015' }
      ]

      testArray.sort(DateSort.bind(null, -1))

      expect(testArray).to.deep.equal([
        { date: 'Fri Oct 23 2015' },
        { date: 'Wed Oct 21 2015' },
        { date: 'Mon Oct 19 2015' },
        { date: 'Tue Oct 13 2015' }
      ])

      return done()
    })
  })
})
