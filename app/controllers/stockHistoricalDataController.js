const http = require('axios');

const baseUrl = `https://api.tdameritrade.com/v1/marketdata`
const apiKey = process.env['TD_API_KEY']

const getUrl = symbol => `${baseUrl}/${symbol}/pricehistory?apikey=${apiKey}&periodType=year&period=1&frequencyType=daily&frequency=1`

async function fetchHistoricalDataBySymbol(symbol) {
  const url = getUrl(symbol)

  try {
    const res = await http.get(url)
    return res && res.data;
  } catch(err) {
    console.log('Error fetching historical data: ', err);
    return {};
  }
}

module.exports = {
    fetchHistoricalDataBySymbol,
}