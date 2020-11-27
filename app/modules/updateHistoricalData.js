
const { fetchHistoricalDataBySymbol } = require('@controllers/stockHistoricalDataController');
const { fetchDataByWorksheetIndex } = require('@controllers/spreadsheetController');
const { upsertHistoricalData } = require('@controllers/postgresController');
const waitFor = require('@utils/waitFor');

const watchlistSheetIndex = 0;

async function updateHistoricalData() {
  try {
    const symbols = await fetchDataByWorksheetIndex(watchlistSheetIndex);
    const symbolsIterable = Object.keys(symbols);
    const historicalDataRequests = symbolsIterable.map(stockSymbol => {
      return new Promise(async (resolve, reject) => {
        try {
          // wait for api limits to clear
          await waitFor()
          const result = await fetchHistoricalDataBySymbol(stockSymbol)
          await upsertHistoricalData(stockSymbol, result.candles)
          resolve({ [stockSymbol]: result.candles });
        } catch (err) {
          console.log('Error while making historical data requests list: ', err);
          reject(err)
          throw err;
        }
      })
    })

    Promise.all(historicalDataRequests).then(() => {
      console.log('Historical data saved')
    }).catch(err => {
      console.log('Error in promise.all for historical data requests: ', err);
    })
  } catch (err) {
    console.log('Error while fetching historical data: ', err);
    throw err;
  } 
}

module.exports = updateHistoricalData;