import {CronJob} from 'cron'

let jobs = {}

export default function (job, frequency) {
  let name = job.prototype.constructor.name

  if (jobs[name]) jobs[name].stop()

  jobs[name] = new CronJob({
    cronTime: frequency,
    onTick: job,
    start: true,
    timeZone: 'America/New_York'
  })
}
