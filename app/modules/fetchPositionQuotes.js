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

const getPercentChange = (from, to) => {
  const top = from - to;
  const bottom = (from + to) / 2;
  return (top / bottom) * 100;
}

const formatPercent = val => `${val.toFixed(2)}%`;

const getAskTo52WeekHigh = (high, ask) => high - ask;

async function fetchPositionQuotes() {
  try {
    const positions = await fetchDataByWorksheetIndex(positionsSheetIndex);
    const quotes = await fetchRecentQuotes(positions);
    const positionsRows = await fetchRows(positionsSheetIndex);

    positionsRows.forEach(async row => {
      const { symbol } = row;
      const quote = quotes[symbol];
      const { askPrice, openPrice, highPrice, lowPrice, '52WkHigh': yearHigh, '52WkLow': yearLow } = quote || {};
      const position = parseNumber(row.position)
      const positionAskDiff = getPercentChange(askPrice, position);

      row.position = position || askPrice;
      row.volume = row.volume || 30;
      row['position ask diff'] = formatPercent(positionAskDiff);
      row.ask = askPrice;
      row.open = openPrice;
      row.high = highPrice;
      row.low = lowPrice;
      row['52 week high'] = yearHigh;
      row['52 week low'] = yearLow;
      row['ask to 52 week high'] = getAskTo52WeekHigh(yearHigh, askPrice);
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
