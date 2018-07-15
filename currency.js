const jsDom = require('jsdom');
const https = require('https');
const http = require('http');

const {
    JSDOM
} = jsDom;

// function showExchangeRate() {
//     const options = getHttpsOptions()
// }

const currentDate = new Date().toISOString().split('T')[0];

const options = {
    hostname: 'minfin.com.ua',
    path: `/currency/nbu/${currentDate}/`,
    method: 'GET',
    port: 443,
    headers: {
        'Content-Type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36'
    },
    rejectUnauthorized: false
}

function getHttpsOptions(hostname, path, headers) {
    const options = {
        hostname: 'minfin.com.ua',
        path: `/currency/nbu/${currentDate}/`,
        method: 'GET',
        port: 443,
        headers: {
            'Content-Type': 'text/html',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36'
        },
        rejectUnauthorized: false
    }
}

const getMinfinDOM = https.request(options, (res) => {
    const buf = new Array();
    res.on('data', (chunk) => {
        buf.push(chunk);
    });

    res.on('end', () => {
        const doc = new JSDOM(Buffer.concat(buf).toString()).window.document;
        showExchange(doc.querySelectorAll('.js-ex-rates'));
        console.log()
    })

})
getMinfinDOM.end();


function showExchange(domItems) {
    console.log(`Курс НБУ на ${currentDate}:`);
    console.log();
    for (let i = 0; i < 3; i++) {
        let currency = domItems[i].querySelector('a').textContent.toLowerCase();
        currency = currency.substring(0, 1).toUpperCase() + currency.substring(1);
        let exchangeRate = domItems[i].querySelector('.data-title');
        for (let j = 0; j <= exchangeRate.children.length; j++) {
            exchangeRate.querySelector('span').remove();
        }
        exchangeRate = exchangeRate.textContent.replace(/\n/g, '').trim();
        console.log(`${currency} - ${exchangeRate}`)
    }
}