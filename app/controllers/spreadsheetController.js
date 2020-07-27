const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = JSON.parse(process.env['SERVICE_ACCOUNT']);
const email = creds['client_email'];
const privateKey = creds['private_key'];

const spreadsheetId = process.env['GOOGLE_DOC_ID'];
const spreadsheet = new GoogleSpreadsheet(spreadsheetId)

if (!email || !privateKey) {
  console.log('no email or private key')
  return;
}

async function authenticate () {
  await spreadsheet.useServiceAccountAuth({
    client_email: email,
    private_key: privateKey,
  });
}

async function fetchSpreadSheet () {
  try {
    await authenticate()
  } catch (err) {
    console.error('Auth error while fetching sheet: ', err);
  }

  try {
    await spreadsheet.loadInfo();
  } catch (err) {
    console.error('Error loading spreadsheet info in fetch sheet: ', err);
  }

  return spreadsheet;
}

async function fetchWorkSheet(index) {
  try {
    const fullSpreadsheet = await fetchSpreadSheet();
    return fullSpreadsheet.sheetsByIndex[index];
  } catch (err) {
    console.error('Error fetching worksheet: ', err);
    return {};
  }
}

async function fetchRows(index) {
  try {
    const workSheet = await fetchWorkSheet(index);
    const rows = await workSheet.getRows();
    return rows;
  } catch (err) {
    console.error('Error fetching rows: ', err);
  }
}

async function fetchWorkSheetHeaders(index) {
  try {
    const workSheet = await fetchWorkSheet(index);
    await workSheet.loadHeaderRow();
    return workSheet.headerValues;
  } catch (err) {
    console.error('Error fetching header: ', err);
  }
}

async function fetchDataByWorksheetIndex(index) {
  const rows = await fetchRows(index);
  const headers = await fetchWorkSheetHeaders(index);
  const parseRow = (row, headers) => {
    return headers.reduce((acc, header) => {
      acc[header] = row[header];
      return acc;
    }, {})
  }
  return rows.reduce((acc, row) => {
    const { symbol } = row;
    const parsedRow = parseRow(row, headers)
    if (acc[symbol]) {
      acc[symbol].push(parsedRow);
    } else {
      acc[symbol] = [parsedRow];
    }
    return acc;
  }, {})
}

module.exports = {
  fetchDataByWorksheetIndex,
  fetchRows,
};
