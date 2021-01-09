let grade = require('../data/grade.json')
let blacklist = require('../data/blacklist.json')
let fs = require("fs")

module.exports.run = async (bot, message, args) => {

  if (grade[message.author.id].permlevel < 40) return message.channel.send(`Cette commande est réservée au staff du bot.`)
  let blacklistuser = message.guild.member(message.mentions.users.first()) || bot.users.get(args[0]);
  if (!blacklistuser) return message.channel.send('Utilisateur Incorrect.')

  if (!blacklist[blacklistuser.id]) {
    blacklist[blacklistuser.id] = {
      user: false
    };
  }

  if (!grade[blacklistuser.id]) {
    grade[blacklistuser.id] = {
      permlevel: "0"
    };
  }

  if (grade[blacklistuser.id].permlevel > 40) return message.channel.send(`Impossible de blacklist un autre staff.`)
  if (blacklist[blacklistuser.id].user === true) return message.channel.send(`Cette personne est déja blacklist.`)

  blacklist[blacklistuser.id].user = true

  message.channel.send(`${blacklistuser} a été ajouté a la blacklist.`)

  fs.writeFile("./data/blacklist.json", JSON.stringify(blacklist), (err) => {
    if (err) console.log(err)
  });
}

module.exports.help = {
  name: "blacklist",
  category: "Staff Bot"
}