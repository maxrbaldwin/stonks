require('module-alias/register');

const updateHistoricalData = require('@modules/updateHistoricalData');

function everyDayJobs() {
  updateHistoricalData()
}

everyDayJobs();