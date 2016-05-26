const Cron = require('cron')

let jobs = {}

module.exports = function (job, frequency) {
  let {name} = job.prototype.constructor

  if (jobs[name]) jobs[name].stop()

  jobs[name] = new Cron.CronJob({
    cronTime: frequency,
    onTick: job,
    start: true,
    timeZone: 'America/New_York'
  })
}
