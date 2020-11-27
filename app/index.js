require('module-alias/register')

const { fetchHistoricalData } = require('@controllers/postgresController');


async function processData() {
  try {
    const historicalData = await fetchHistoricalData()
    console.log('historical: ', historicalData)
  } catch (fetchHistoricalDataErr) {
    console.log('Error fetching historical data while processing data: ', fetchHistoricalDataErr);
  } 
}


function getDaysAgoDateTime(dateTime, daysAgo) {
  const oneDayInMilliseconds = (24*60*60*1000);
  const daysAgoDateTime = oneDayInMilliseconds * daysAgo;
  return dateTime - daysAgoDateTime;
}


processData();
