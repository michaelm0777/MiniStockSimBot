const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require("./config.json");
const User = require('./commands/data/prof.js');
var puppeteer = require('puppeteer');

const fs = require('fs');
bot.commands = new Discord.Collection();
var existsdatajson = fs.existsSync('./commands/data/data.json');
var words; 
if (existsdatajson) {
    // Read the file
    console.log('loading words');
    var txt = fs.readFileSync('./commands/data/data.json', 'utf8');
    // Parse it  back to object
    words = JSON.parse(txt);
} else {
    // Otherwise start with blank list
    console.log('No words');
    words = {};
}
var commands = [];
var commandsparameters = [];
var commandscomments = [];
var commandsdescriptions = [];
var index = 0;
var a = 0;
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    if (command.onlyOwner == false) {
        commands[index] = command.name;
        commandsparameters[index] = command.parameters;
        commandsdescriptions[index] = command.description;
        commandscomments[index] = command.comment;
        index++;
    }
}
bot.once('ready', () => {
    console.log('This bot is online!');
});
var express = require('express');

var api = require('./api');

var app = express();

app.use('/', api);

app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
const general = new Set();

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) { return; }
    let args = message.content.substring(prefix.length).split(/ +/);
    let command = args[0];
    args.shift();
    var author = message.author.id;
    var txt = fs.readFileSync('./commands/data/data.json', 'utf8');
    words = JSON.parse(txt);
    if (author in words) {

    }
    else {
        let mt = {};
        var user = new User(message.author.tag, 10000, mt);
        words[author] = user;
        var json = JSON.stringify(words, null, 2);
        fs.writeFile('./commands/data/data.json', json, 'utf8', finished);
        function finished(err) {
            console.log(`${author} added to data.json`);
        }
    }
    setTimeout(() => {
        switch (command) {
            case "bal":
            case "prof":
                if (general.has(author)) { } else {
                    bot.commands.get('prof').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;
            case "test":
                if (general.has(author)) { } else {
                    bot.commands.get('test').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;
            /*case "testt":
                if (general.has(author)) { } else {
                    bot.commands.get('testt').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;*/
            case "buy":
                if (general.has(author)) { } else {
                    if (!args[0]) { return message.reply("Missing argument 1"); }
                    if (!args[1]) { return message.reply("Missing argument 2"); }

                    bot.commands.get('buy').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;
            case "sell":
                if (general.has(author)) { } else {
                    if (!args[0]) { return message.reply("Missing argument 1"); }
                    if (!args[1]) { return message.reply("Missing argument 2"); }
                    bot.commands.get('sell').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;
            case "price":
                if (general.has(author)) { } else {
                    if (!args[0]) { return message.reply("Missing argument 1"); }
                    bot.commands.get('price').execute(message, args, User);
                    cooldown(general, 1050, author);
                }
                break;
        }
    }, 10)
});
function cooldown(timer, time, author) {
    timer.add(author);
    setTimeout(() => {
        timer.delete(author);
    }, time);
}



bot.login(token);