require('module-alias/register');

const fetchPositionQuotes = require('@modules/fetchPositionQuotes');

function jobs() {
  fetchPositionQuotes()
}

jobs();