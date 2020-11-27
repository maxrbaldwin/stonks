const { Client } = require('pg');

const clientConfig = {
  host: process.env['MXS_DB_HOST'],
  database: process.env['MXS_DB_NAME'],
  port: process.env['MXS_DB_PORT'],
  user: process.env['MXS_DB_USER'],
  password: process.env['MXS_DB_PASSWORD'],
  ssl: {
    rejectUnauthorized: false
  }
}

async function upsertHistoricalData(stockSymbol, data) {
  const client = new Client(clientConfig);
  const formattedStockSymbol = stockSymbol.toUpperCase();
  const formattedData = JSON.stringify(data);

  return new Promise(async (resolve, reject) => {
    try {
      try {
        await client.connect();
      } catch (connectErr) {
        console.log('Error connecting during historical data upsert: ', connectErr);
        reject(connectErr)
        throw connectErr;
      }
      
      try {
        const selectResult = await client.query(`SELECT * FROM stocks WHERE stock_symbol='${formattedStockSymbol}'`);

        if (selectResult.rows.length > 0) {
          // update existing
          try {
            await client.query(`UPDATE stocks SET historical_data='${formattedData}' WHERE stock_symbol='${formattedStockSymbol}'`);  
          } catch (updateErr) {
            console.log('Error updating historical data: ', updateErr);
            reject(connectErr)
            throw updateErr;
          }
          
        } else {
          // insert new
          try {
          await client.query(`INSERT INTO stocks (stock_symbol, historical_data) VALUES ('${formattedStockSymbol}', '${formattedData}')`)
          } catch (insertError) {
            console.log('Error inserting historical data: ', insertError);
            reject(connectErr)
            throw insertError;
          }
        }
      } catch (selectErr) {
        console.log('Error trying to select by stock symbol while upserting historical data: ', selectErr);
      }

      try {
        await client.end();
        resolve()
      } catch (endErr) {
        console.log('Error ending connection during historical data upsert: ', endErr);
        reject(connectErr)
        throw endErr;
      } 
    } catch (err) {
      console.log('Error in upsert historical data query: ', err);
      reject(connectErr)
      throw err;
    }
  })
}

async function fetchHistoricalData() {
  return new Promise(async (resolve, reject) => {
    const client = new Client(clientConfig);

    try {
      await client.connect()
    } catch (connectionErr) {
      console.log('Error connecting while trying to fetch historical data: ', err);
      reject()
      throw connectionErr;
    }

    try {
      const selectResult = await client.query(`SELECT stock_symbol, historical_data FROM stocks`);
      resolve(selectResult.rows);
    } catch (selectErr) {
      console.log('Error fetching historical data: ', )
      reject()
      throw selectErr;
    }
  })
}

module.exports = {
  upsertHistoricalData,
  fetchHistoricalData,
}