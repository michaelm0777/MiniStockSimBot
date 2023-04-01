var puppeteer = require('puppeteer');
const Discord = require('discord.js');

module.exports = {
    name: 'testt',
    description: "Test",
    onlyOwner: false,
    comment: "",
    parameters: " <person>",
    async execute(message, args, User) {
        await getStockPrice(message, args[0]);

    }
}
async function getStockPrice(message, symbol) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`http://steelbb.com/?PageID=93&series_id=442`, { waitUntil: "networkidle2" });
    await page.type('input[name="username"]', 'cmeng@dovercorp.com');
    await page.type('input[name="password"]', 'Dovermetals2020');
    await page.click('input[name="doLogin"]');
}