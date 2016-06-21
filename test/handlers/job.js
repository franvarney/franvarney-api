const {expect} = require('code')
const Lab = require('lab')
const {stub} = require('sinon')

const lab = exports.lab = Lab.script()
const {describe, it, beforeEach, afterEach} = lab

const Job = require('../../server/handlers/job')
const JobModel = require('../../server/models/job')

let date = Date.now()
let jobs
let newJob
let newJob2
let request

describe('handlers/job', () => {
  beforeEach((done) => {
    request = {
      query: {
        auth_token: 'secret'
      },
      params: {
        id: 'abc123'
      },
      payload: {
        employer: 'Test Employer',
        location: {
          city: 'City',
          state: 'State'
        },
        dates: {
          start: '0114',
          end: '1115'
        },
        title: 'Test Title'
      }
    }

    newJob = request.payload
    newJob.createdAt = date
    newJob.id = 'abc123'

    newJob2 = Object.assign({}, request.payload)
    newJob2.employer = 'Test Employer 2'
    newJob2.id = 'def456'

    jobs = [newJob, newJob2]

    stub(JobModel, 'create').yields(new Error('job create'))
    stub(JobModel, 'find').yields(new Error('job find'))
    stub(JobModel, 'findOne').yields(new Error('job findOne'))
    stub(JobModel, 'remove').yields(new Error('job remove'))
    stub(JobModel, 'update').yields(new Error('job update'))

    return done()
  })

  afterEach((done) => {
    JobModel.create.restore()
    JobModel.find.restore()
    JobModel.findOne.restore()
    JobModel.remove.restore()
    JobModel.update.restore()

    return done()
  })

  describe('create', () => {
    describe('when a job is created', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, [])
        JobModel.create.yields(null, newJob)

        return done()
      })

      it('yields a new job', (done) => {
        JobModel.create(request, (err, created) => {
          expect(err).to.be.null()
          expect(created.createdAt).to.equal(date)
          return done()
        })
      })
    })

    describe('when a job is not created', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, [])
        return done()
      })

      it('yields an error', (done) => {
        Job.create(request, (err) => {
          expect(err.message).to.equal('Error: job create')
          return done()
        })
      })
    })
  })

  describe('get', () => {
    describe('when a job exists', () => {
      beforeEach((done) => {
        newJob.id = 'abc123'
        JobModel.findOne.yields(null, newJob)
        return done()
      })

      it('yields the job', (done) => {
        Job.get(request, (job) => {
          expect(job.id).to.equal('abc123')
          return done()
        })
      })
    })

    describe('when a job doesn\'t exist', () => {
      it('yields an error', (done) => {
        Job.get(request, (err) => {
          expect(err.message).to.equal('Error: job findOne')
          return done()
        })
      })
    })
  })

  describe('getAll', () => {
    describe('when jobs exist', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, jobs)
        return done()
      })

      it('yields the jobs', (done) => {
        Job.getAll(request, (results) => {
          expect(results[0].id).to.equal('abc123')
          expect(results[1].id).to.equal('def456')
          return done()
        })
      })
    })

    describe('when no jobs exist', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, [])
        return done()
      })

      it('yields an empty array', (done) => {
        Job.getAll(request, (results) => {
          expect(results).to.empty()
          return done()
        })
      })
    })
  })

  describe('remove', () => {
    describe('when a job exists', () => {
      beforeEach((done) => {
        JobModel.remove.yields()
        return done()
      })

      it('is deleted and yields undefined', (done) => {
        Job.remove(request, (results) => {
          expect(results).to.be.undefined()
          return done()
        })
      })
    })

    // TODO: Add in after adding a pre remove to the jobs model
    // describe('when the job does not exist', () => {
    //   it('yields an error', (done) => {
    //     Job.remove(request, (err) => {
    //       return done()
    //     })
    //   })
    // })
  })

  describe('update', () => {
    describe('when jobs exist', () => {
      beforeEach((done) => {
        JobModel.update.yields(null, newJob.id)
        return done()
      })

      it('updates the job and yields the job id', (done) => {
        Job.update(request, (result) => {
          expect(result).to.equal('abc123')
          return done()
        })
      })
    })

    // TODO: Add in after adding a pre remove to the jobs model
    // describe('when the job does not exist', () => {
    //   it('yields an error', (done) => {
    //     Job.update(request, (err) => {
    //       return done()
    //     })
    //   })
    // })
  })
})
