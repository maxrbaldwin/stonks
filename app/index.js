require('module-alias/register');

const CronJob = require('cron').CronJob;
const fetchPositionQuotes = require('@modules/fetchPositionQuotes');

const everyThreeMinutes = '0 */3 * * * *';

const fetchPositionQuotesJob = new CronJob(
  everyThreeMinutes,
  fetchPositionQuotes,
  null,
  true,
  'America/New_York',
  null,
  true,
);

const jobs = [
  fetchPositionQuotesJob,
];

jobs.forEach(job => {
  job.start();
})

// for local testing
// function jobs() {
//   fetchPositionQuotes()
// }

// jobs();