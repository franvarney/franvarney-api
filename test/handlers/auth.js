const {expect} = require('code')
const Lab = require('lab')

const lab = exports.lab = Lab.script()
const {describe, it} = lab

const Auth = require('../../server/handlers/auth')
const Config = require('../../config')

let validate = Auth.validate.bind({ method: 'GET', path: '/test' })

describe('handlers/auth', () => {
  describe('validate', () => {
    describe('when a token is valid', () => {
      it('returns valid with the token', (done) => {
        validate('secret', (err, isValid, token) => {
          expect(err).to.be.null()
          expect(isValid).to.be.true()
          expect(token.token).to.equal(Config.authToken)

          return done()
        })
      })
    })

    describe('when a token is not valid', () => {
      it('returns invalid with the token', (done) => {
        validate('secret2', (err, isValid, token) => {
          expect(err.message).to.equal('Invalid token')
          expect(isValid).to.be.false()
          expect(token.token).to.equal('secret2')

          return done()
        })
      })
    })
  })
})
