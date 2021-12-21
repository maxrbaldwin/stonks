require('module-alias/register');

const CronJob = require('cron').CronJob;
const fetchPositionQuotes = require('@modules/fetchPositionQuotes');
const fetchEarningsCalendar = require('@modules/fetchEarningsCalendar');

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

const fetchEarningsCalendarJob = new CronJob(
  everyThreeMinutes,
  fetchEarningsCalendar,
  null,
  true,
  'America/New_York',
  null,
  true,
);



const jobs = [
  // fetchPositionQuotesJob,
  fetchEarningsCalendarJob
];

jobs.forEach(job => {
  job.start();
})