const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let blacklist = require('./blacklist.json')
let grade = require('./grade.json')
let gban = require('./gban.json')
const moment = require('moment-fr')
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 5;

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Commande non trouvée.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} Chargée!`);
    bot.commands.set(props.help.name, props);
  });
});




bot.on('guildMemberAdd', member => {

  console.log(`${member}`, "a rejoint le serveur" + `${member.guild.name}`)

    //const role = member.guild.roles.find('ProtectorMembres', 'Membre') // Fait crash le bot
   // member.addRole(role)


  const channel = member.guild.channels.find(ch => ch.name === '😉bienvenue😉');
                    // Do nothing if the channel wasn't found on this server
                    if (!channel) return;
                    // Send the message, mentioning the member
                    channel.send(`Bienvenu(e), ${member} sur le serveur ! Passe un agréable moment 🤙`);

let messageban = "Blacklisted."

  if(!gban[member.id]){
    gban[member.id] = {
      level: "Non"
    };
  }

if(gban[member.id].level === "Oui") return member.ban(messageban)

});



bot.on("message", async message => {






let messageArrayy = message.content.split(" ");
let argss = messageArrayy.slice(1);


  if(message.channel.type === "dm") return;





  let prefix = botconfig.prefix//prefixes[message.guild.id].prefixes

  let mention = message.guild.member(message.mentions.users.first() || message.guild.members.get(argss[0]));
  if(mention === message.guild.me) return message.channel.send(`**__Prefix:__**\nServeur: ${prefix}\nDefaut: *`)

  if(!message.content.startsWith(prefix)) return;

  if(message.author.bot) return;






  

    if(!gban[message.author.id]){
      gban[message.author.id] = {
        level: "Non"
      };
    }

      fs.writeFile("./gban.json", JSON.stringify(gban), (err) => {
    if(err) console.log(err)
  });


      if(!blacklist[message.author.id]){
      blacklist[message.author.id] = {
        user: "Non"
      };
    }

          fs.writeFile("./blacklist.json", JSON.stringify(blacklist), (err) => {
    if(err) console.log(err)
  });






if(blacklist[message.author.id].user === "Oui") return message.channel.send(`Vous etes blacklist du bot`)



  if(!grade[message.author.id]){
   grade[message.author.id] = {
     permlevel: 0
  };
  }

    fs.writeFile("./grade.json", JSON.stringify(grade), (err) => {
    if(err) console.log(err)
  });

  


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);








});


let prefixx = botconfig.prefix
function game1(){
    bot.user.setActivity("Besoin d'aide ? " + prefixx + "help");
    bot.user.setStatus('dnd')
    setTimeout(game2, 10000);
};

function game2(){
    bot.user.setActivity(`${bot.guilds.size + 479} serveurs`);
    bot.user.setStatus('dnd')
    setTimeout(game3, 10000);
};

function game3(){
    bot.user.setActivity(`${bot.users.size + 135000} utilisateurs`);
    bot.user.setStatus('dnd')
    setTimeout(game1, 10000);
};

bot.on("ready", () => {





    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
    setTimeout(game1, 10000);
});

bot.login(tokenfile.token);
