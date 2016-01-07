import {expect} from 'code'
import Lab from 'lab'
import {Server} from 'hapi'
import {stub} from 'sinon'

const lab = exports.lab = Lab.script()
const {describe, it, before, after, beforeEach, afterEach} = lab

import Config from '../../config'
import Job from '../../server/handlers/job'
import JobModel from '../../server/models/job'

let date = Date.now(), newJob, request

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

    stub(JobModel, 'create').yields(new Error('job create'))
    stub(JobModel, 'findOne').yields(new Error('job findOne'))

    done()
  })

  afterEach((done) => {
    JobModel.create.restore()
    JobModel.findOne.restore()

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
        newJob._id = 'abc123'
        JobModel.findOne.yields(null, newJob)
        done()
      })

      it('yields the job', (done) => {
        Job.get.handler(request, (job) => {
          expect(job._id).to.equal('abc123')
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
})

