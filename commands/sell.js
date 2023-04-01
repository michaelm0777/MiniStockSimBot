var puppeteer = require('puppeteer');
const User = require('./data/prof.js');

module.exports = {
    name: 'sell',
    description: "Gets a person's balance.",
    onlyOwner: false,
    comment: "It's not really the balance it's the profile.",
    parameters: " <person>",
    async execute(message, args, User) {
        var stop = false;
        var amount = parseInt(args[1]);
        const Discord = require('discord.js');
        const fs = require('fs');
        var txt = fs.readFileSync('./commands/data/data.json', 'utf8');
        words = JSON.parse(txt);
        var bal = words[message.author.id].balance.toFixed(2);
        let data = await getStockPrice(message, args[0]).catch(() => {
            const emb = new Discord.MessageEmbed()
                .setColor('#00bFFF')
                .setTitle(`Stock Not Found.`)
                .setTimestamp()
                .setFooter('');
            message.channel.send(emb);
            stop = true;
        });
        if (!stop) {
            let price = parseFloat(data[1].replace(/,/g, ''));
            var stonks = words[message.author.id].stocks;
            if (data[0] in stonks) {
                if (amount > stonks[data[0]]) {
                    const emb = new Discord.MessageEmbed()
                        .setColor('#00bFFF')
                        .setTitle(`Insufficient Shares.`)
                        .setTimestamp()
                        .setFooter('');
                    message.channel.send(emb);
                }
                else {
                    words[message.author.id].balance = words[message.author.id].balance + parseFloat(parseInt(amount) * parseFloat(price));
                    words[message.author.id].stocks[data[0]] = stonks[data[0]] - amount;
                    if (stonks[data[0]] - amount == 0) {
                        delete words[message.author.id].stocks[data[0]];
                    }
                    const emb = new Discord.MessageEmbed()
                        .setColor('#00bFFF')
                        .setTitle(`${message.author.tag} sold ${amount} shares of ${data[0]}.`)
                        .setDescription(`+ ⊛ ${amount * price}`)
                        .setTimestamp()
                        .setFooter('');
                    message.channel.send(emb);
                }
                var json = JSON.stringify(words, null, 2);
                fs.writeFile('./commands/data/data.json', json, 'utf8', finished);
                function finished(err) {
                    console.log(`${message.author.tag} buys`);
                }
            }
            else {
                const emb = new Discord.MessageEmbed()
                    .setColor('#00bFFF')
                    .setTitle(`Insufficient Shares.`)
                    .setTimestamp()
                    .setFooter('');
                message.channel.send(emb);
            }
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