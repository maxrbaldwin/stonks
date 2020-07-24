const http = require('axios');

const baseUrl = 'https://api.tdameritrade.com/v1/marketdata/quotes'
const apiKey = process.env['TD_API_KEY']

const getUrl = symbols => `${baseUrl}?apikey=${apiKey}&symbol=${symbols}`;

async function fetchRecentQuotes(positions) {
  const symbolsParameter = Object.keys(positions).toString();
  const url = getUrl(symbolsParameter);

  try {
    const res = await http.get(url);
    return res.data;
  } catch (err) {
    console.log('Error fetching quotes: ', err);
    return {};
  }
}

module.exports = {
  fetchRecentQuotes,
}

// Movers api call
// https://api.tdameritrade.com/v1/marketdata/$SPX.X/movers?apikey=