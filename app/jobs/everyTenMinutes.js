require('module-alias/register');

const fetchPositionQuotes = require('@modules/fetchPositionQuotes');

function everyTenMinutesJobs() {
  fetchPositionQuotes()
}

everyTenMinutesJobs();