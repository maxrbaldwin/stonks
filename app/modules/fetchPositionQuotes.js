const { fetchRecentQuotes } = require('@controllers/stockQuoteController');
const { fetchDataByWorksheetIndex, fetchRows } = require('@controllers/spreadsheetController');

const positionsSheetIndex  = 0;

const getPercentChange = (high, low) => `${((high - low) / high) * 100}%`;
const parseNumber = number => typeof number === 'string' && number.substring(0,1) === '$' ? parseFloat(number.replace('$', '')) : parseFloat(number); 

async function fetchPositionQuotes() {
  try {
    const positions = await fetchDataByWorksheetIndex(positionsSheetIndex);
    const quotes = await fetchRecentQuotes(positions);
    const positionsRows = await fetchRows(positionsSheetIndex);

    positionsRows.forEach(async row => {
      const { symbol } = row;
      const quote = quotes[symbol];
      const { openPrice, highPrice, lowPrice } = quote;
      const buyAt = parseNumber(row['buy at'] || 0);
      const sellAt = parseNumber(row['sell at'] || 0);

      row.open = openPrice;
      row.high = highPrice;
      row.low = lowPrice;
      row['high/low % diff'] = getPercentChange(highPrice, lowPrice);
      row.volume = row.volume || 10;
      row['calculated goal'] = (sellAt - buyAt) * row.volume
      row['buy at'] = buyAt
      row['sell at'] = sellAt
      row['goal % change'] = getPercentChange(sellAt, buyAt);
      row['total investment'] = buyAt * row.volume;
      
      await row.save()
    })
  } catch (err) {
    console.log('Error quoting positions: ', err);
  }
}

module.exports = fetchPositionQuotes
