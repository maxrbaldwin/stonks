const axios = require('axios');
const cheerio = require('cheerio');

async function fetchEarningsCalendar() {
    // fetch
    const res = await axios.get('https://finance.yahoo.com/calendar/earnings?day=2021-10-04');
    const html = res.data;

    // scrape
    // https://cheerio.js.org/classes/Cheerio.html
    const $ = cheerio.load(html);
    const thisWeekDays = $('#mrt-node-Lead-6-CalEvents ul li');
    // https://cheerio.js.org/classes/Cheerio.html#map
    const weekMap = thisWeekDays.map((i, el) => $(el).find('a').attr('href'));

    // parse links
    const weekLinks = [...weekMap].map((url) =>`https://finance.yahoo.com${url}`)

    // make requests
    const requests = weekLinks.map(link => axios.get(link))
    const responses = await Promise.all(requests);
    
    const rows = responses.map(res => {
        const $$ = cheerio.load(res.data);
        const rs = $$('#cal-res-table tr');
        rs.each(el => {
            const tds = $$(rs[el]).find('td')
            tds.each(td => {
                const a = $$(tds[td]).find('a')
                console.log($$(a).text())
            })
        });
    })

}

// fetch calendar by day
// scarape urls from that response
// fetch those urls
// scrape stock symbols off those links

module.exports = fetchEarningsCalendar;