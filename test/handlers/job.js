import {expect} from 'code'
import Lab from 'lab'
import {Server} from 'hapi'
import {stub} from 'sinon'

const lab = exports.lab = Lab.script()
const {describe, it, before, after, beforeEach, afterEach} = lab

import Config from '../../config'
import Job from '../../server/handlers/job'
import JobModel from '../../server/models/job'

let date = Date.now(), jobs, newJob, newJob2, request

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

    done()
  })

  afterEach((done) => {
    JobModel.create.restore()
    JobModel.find.restore()
    JobModel.findOne.restore()
    JobModel.remove.restore()

    done()
  })

  describe('create', () => {
    describe('when a job is created', () => {
      beforeEach((done) => {
        JobModel.create.yields(null, newJob)
        done()
      })

      it('yields a new job', (done) => {
        Job.create.handler(request, (created) => {
          expect(created.createdAt).to.equal(date)
          done()
        })
      })
    })

    describe('when a job is not created', () => {
      it('yields an error', (done) => {
        Job.create.handler(request, (err) => {
          expect(err.message).to.equal('job create')
          done()
        })
      })
    })
  })

  describe('get', () => {
    describe('when a job exists', () => {
      beforeEach((done) => {
        newJob.id = 'abc123'
        JobModel.findOne.yields(null, newJob)
        done()
      })

      it('yields the job', (done) => {
        Job.get.handler(request, (job) => {
          expect(job.id).to.equal('abc123')
          done()
        })
      })
    })

    describe('when a job doesn\'t exist', () => {
      it('yields an error', (done) => {
        Job.get.handler(request, (err) => {
          expect(err.message).to.equal('job findOne')
          done()
        })
      })
    })
  })

  describe('getAll', () => {
    describe('when jobs exist', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, jobs)
        done()
      })

      it('yields the jobs', (done) => {
        Job.getAll.handler(request, (results) => {
          expect(results[0].id).to.equal('abc123')
          expect(results[1].id).to.equal('def456')
          done()
        })
      })
    })

    describe('when no jobs exist', () => {
      beforeEach((done) => {
        JobModel.find.yields(null, [])
        done()
      })

      it('yields an empty array', (done) => {
        Job.getAll.handler(request, (results) => {
          expect(results).to.empty()
          done()
        })
      })
    })
  })

  describe('remove', () => {
    describe('when a job exists', () => {
      beforeEach((done) => {
        JobModel.remove.yields()
        done()
      })

      it('is deleted and yields undefined', (done) => {
        Job.remove.handler(request, (results) => {
          expect(results).to.be.undefined()
          done()
        })
      })
    })

    // TODO: Add in after adding a pre remove to the jobs model
    // describe('when the job does not exist', () => {
    //   it('yields an error', (done) => {
    //     Job.remove.handler(request, (err) => {
    //       done()
    //     })
    //   })
    // })
  })
})

