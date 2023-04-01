var router = require('express').Router();
var puppeteer = require('puppeteer');

router.route('/stock/:ticker').get(async (req, res) => {
    let ticker = req.ticker;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    let url = `https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`;

    await page.goto(url);
    await page.waitFor('#quote-market-notice', { timeout: 1000 });
    let price = await page.evaluate(() => document.querySelector("#quote-header-info > div.Pos\\(r\\) > div > div > span").textContent);
    await browser.close();

    res.send({ ticker, price });
});

router.param('ticker', (req, res, next, ticker) => {
    req.ticker = ticker.toUpperCase();
    next();
});

module.exports = router;