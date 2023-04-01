var puppeteer = require('puppeteer');
const Discord = require('discord.js');

module.exports = {
    name: 'test',
    description: "Test",
    onlyOwner: false,
    comment: "",
    parameters: " <person>",
    async execute(message, args, User) {
        await getStockPrice(message,args[0]);
        
    }
}
async function getStockPrice(message,symbol){
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${symbol}+stock`, {waitUntil: "networkidle2"});

    let data = await page.evaluate(() => {
        let symbol = document.querySelector('div[class="HfMth"]>span[class="WuDkNe"]').innerText;
        let price = document.querySelector('div[class="wGt0Bc"]>div>span>span[jscontroller="q6ctOd"]>span[jsname="vWLAgc"]').innerText;
        return  `${symbol}: ${price}`;
    });
    message.channel.send( data);
    await browser.close();
}