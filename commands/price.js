var puppeteer = require('puppeteer');
const User = require('./data/prof.js');

module.exports = {
    name: 'price',
    description: "buy.",
    onlyOwner: false,
    comment: "It's not really the balance it's the profile.",
    parameters: " <person>",
    async execute(message, args, User) {
        var stop = false;
        const Discord = require('discord.js');
        let data = await getStockPrice(message, args[0]).catch((err) => {
            const emb = new Discord.MessageEmbed()
                .setColor('#00bFFF')
                .setTitle(`Stock Not Found.`)
                .setTimestamp()
                .setFooter('');
            message.channel.send(emb);
            message.reply(err);
            stop = true;
        });
        if (!stop) {
            message.reply(`${data[0]}: ${data[1]}`);
        }
    }
}
async function getStockPrice(message, symbol) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(`https://www.google.com/search?q=${symbol}+stock`, { waitUntil: "domcontentloaded" });

    let data = await page.evaluate(() => {
        let symbol = document.querySelector('div[class="HfMth"]>span[class="WuDkNe"]').innerText;
        let price = document.querySelector('div[class="wGt0Bc"]>div>span>span[jscontroller="q6ctOd"]>span[jsname="vWLAgc"]').innerText;
        return [symbol, price];
    });
    await browser.close();
    console.log(data);
    return data;
}
