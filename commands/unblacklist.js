let grade = require('../data/grade.json')
let blacklist = require('../data/blacklist.json')
let fs = require("fs")

module.exports.run = async (bot, message, args) => {

  if (grade[message.author.id].permlevel < 40) return message.channel.send(`Cette commande est réservée au staff du bot.`)
  let unblacklistuser = message.guild.member(message.mentions.users.first()) || bot.users.get(args[0]);
  if (!unblacklistuser) return message.channel.send(`Utilisateur Incorrect.`)

  if (!blacklist[unblacklistuser.id]) {
    blacklist[unblacklistuser.id] = {
      user: "Non"
    };
  }

  if (!grade[unblacklistuser.id]) {
    grade[unblacklistuser.id] = {
      permlevel: "0"
    };
  }

  if (blacklist[unblacklistuser.id].user === "Non") return message.channel.send(`Cette personne n'est pas blacklist.`)

  blacklist[unblacklistuser.id].user = "Non"

  message.channel.send(`${unblacklistuser} a été retiré de la blacklist.`)

  fs.writeFile("./data/blacklist.json", JSON.stringify(blacklist), (err) => {
    if (err) console.log(err)
  });
}

module.exports.help = {
  name: "unblacklist",
  category: "Staff Bot"
}