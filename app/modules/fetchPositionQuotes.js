const { fetchRecentQuotes } = require('@controllers/stockQuoteController');
const { fetchDataByWorksheetIndex, fetchRows } = require('@controllers/spreadsheetController');

const positionsSheetIndex  = 0;

const getTenPercentChange = (position, volume) => {
  const tenPercent = 10/100;
  const tenPercentChange = ((position * tenPercent) + position) * volume;
  const totalInvestment = position * volume;
  return tenPercentChange - totalInvestment;
}

const getFivePercentLoss = (position, volume) => {
  const negativeFivePercent = (5/100);
  const negativeFivePercentChange = ((position * negativeFivePercent) + position) * volume;
  const totalInvestment = position * volume;
  return totalInvestment - negativeFivePercentChange;
}

const getLimitOrder = position => {
  const tenPercent = 10/100;
  const tenPercentOf = position * tenPercent;
  return position + tenPercentOf;
}

const getStopLoss = position => {
  const negativeFivePercent = (5/100) * -1;
  const negativeFivePercentOf = position * negativeFivePercent
  return position + negativeFivePercentOf
}

const parseNumber = number => typeof number === 'string' && number.substring(0,1) === '$' ? parseFloat(number.replace('$', '')) : parseFloat(number);

async function fetchPositionQuotes() {
  try {
    const positions = await fetchDataByWorksheetIndex(positionsSheetIndex);
    const quotes = await fetchRecentQuotes(positions);
    const positionsRows = await fetchRows(positionsSheetIndex);

    positionsRows.forEach(async row => {
      const { symbol } = row;
      const quote = quotes[symbol];
      const { askPrice, openPrice, highPrice, lowPrice } = quote || {};
      const position = parseNumber(row.position)

      row.position = position || askPrice;
      row.volume = row.volume || 30;
      row.ask = askPrice;
      row.open = openPrice;
      row.high = highPrice;
      row.low = lowPrice;
      row['ten percent gain'] = getTenPercentChange(position, row.volume);
      row['five percent loss'] = getFivePercentLoss (position, row.volume);
      row['limit order'] = getLimitOrder(position)
      row['stop loss'] = getStopLoss(position)
      row['total investment'] = position * row.volume;
      
      await row.save()
    })
  } catch (err) {
    console.log('Error quoting positions: ', err);
  }
}

module.exports = fetchPositionQuotes
