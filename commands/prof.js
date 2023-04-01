module.exports = {
    name: 'prof',
    description: "Gets a person's balance.",
    onlyOwner: false,
    comment: "It's not really the balance it's the profile.",
    parameters: " <person>",
    execute(message, args, User) {
        const Discord = require('discord.js');
        const fs = require('fs');
        var txt = fs.readFileSync('./commands/data/data.json', 'utf8');
        words = JSON.parse(txt);
        if (args.length == 0) {
            var bal = words[message.author.id].balance.toFixed(2);
            let description = `Balance: ⊛ ${bal}\n`;
            let stonk = words[message.author.id].stocks;
            Object.keys(stonk).forEach(function (key) {

                description += `${key}: ${stonk[key]}\n`

            });
            const balEmbed = new Discord.MessageEmbed()
                .setColor('#00bFFF')
                .setTitle(`${message.author.tag}'s profile`)
                .setDescription(description)
                .setTimestamp()
                .setFooter('');
            message.channel.send(balEmbed);
            var json = JSON.stringify(words, null, 2);
            fs.writeFile('./commands/data/data.json', json, 'utf8', finished);
            function finished(err) {
                console.log(`${message.author.tag} bals`);
            }
        }
        else {
            var member = message.guild.member(message.mentions.members.first());
            if (member == null) return console.log(`couldn't find the member `);
            var user = member.user;
            if (!user) return console.log(`couldn't find the user `);
            if (user.id in words) {
                var bal = words[user.id].balance.toFixed(2);
                let description = `Balance: ⊛ ${bal}\n`;
                let stonk = words[user.id].stocks;
                Object.keys(stonk).forEach(function (key) {

                    description += `${key}: ${stonk[key]}\n`

                });
                const balEmbed = new Discord.MessageEmbed()
                    .setColor('#00bFFF')
                    .setTitle(`${user.username}'s profile`)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter('');
                message.channel.send(balEmbed);
            }
            else {
                const balEmbed = new Discord.MessageEmbed()
                    .setColor('#00bFFF')
                    .setTitle(`They have not used the bot.`)
                    .setTimestamp()
                    .setFooter('');
                message.channel.send(balEmbed);
            }
        }
        var json = JSON.stringify(words, null, 2);
        fs.writeFile('./commands/data/data.json', json, 'utf8', finished);
        function finished(err) {
            console.log(``);
        }
    }
}
