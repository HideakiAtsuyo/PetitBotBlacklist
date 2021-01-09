const {Client, Collection} = require("discord.js");
const {readdir, writeFile} = require("fs");
const bot = new Client();
bot.commands = new Collection();

let blacklist = require('./data/blacklist.json');
let grade = require('./data/grade.json');
let gban = require('./data/gban.json');

readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if (jsfile.length <= 0) {
		console.log("Commande non trouvée.");
		return;
	}

	jsfile.forEach((f) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} Chargée!`);
		bot.commands.set(props.help.name, props);
	});
});


bot.on('guildMemberAdd', member => {
	console.log(`${member}`, "a rejoint le serveur" + `${member.guild.name}`)
	//const role = member.guild.roles.find('ProtectorMembres', 'Membre'); // Fait crash le bot
	// member.addRole(role);

	const channel = member.guild.channels.find(ch => ch.name === '😉bienvenue😉');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Bienvenu(e), ${member} sur le serveur ! Passe un agréable moment 🤙`);

	let messageban = "Blacklisted."
	if (!gban[member.id]) {
		gban[member.id] = {
			level: false
		};
	}

	if (gban[member.id].level === true) return member.ban(messageban)
});

bot.on("message", async message => {
	const prefix = require("./botconfig.json").prefix;
	let messageArrayy = message.content.split(" ");
	let argss = messageArrayy.slice(1);
	if (message.channel.type === "dm" && message.author.bot && !message.content.startsWith(prefix)) return;

	let mention = message.guild.member(message.mentions.users.first() || message.guild.members.get(argss[0]));
	if (mention === message.guild.me) return message.channel.send(`**__Prefix:__**\nServeur: ${prefix}\nDefaut: *`)

	if (!gban[message.author.id]) {
		gban[message.author.id] = {
			level: false
		};
	}

	writeFile("./data/gban.json", JSON.stringify(gban), (err) => {
		if (err) console.log(err)
	});

	if (!blacklist[message.author.id]) {
		blacklist[message.author.id] = {
			user: false
		};
	}

	writeFile("./data/blacklist.json", JSON.stringify(blacklist), (err) => {
		if (err) console.log(err)
	});

	if (blacklist[message.author.id].user === true) return message.channel.send(`Vous êtes blacklist du Bot`);

	if (!grade[message.author.id]) {
		grade[message.author.id] = {
			permlevel: 0
		};
	}

	writeFile("./data/grade.json", JSON.stringify(grade), (err) => {
		if (err) console.log(err)
	});

	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	let commandfile = bot.commands.get(cmd.slice(prefix.length));
	if (commandfile) commandfile.run(bot, message, args);

});


function game1() {
	bot.user.setActivity("Besoin d'aide ? " + prefix + "help");
	bot.user.setStatus('dnd')
	setTimeout(game2, 10000);
}

function game2() {
	bot.user.setActivity(`${bot.guilds.size + 479} serveurs`);
	bot.user.setStatus('dnd')
	setTimeout(game3, 10000);
}

function game3() {
	bot.user.setActivity(`${bot.users.size + 135000} utilisateurs`);
	bot.user.setStatus('dnd')
	setTimeout(game1, 10000);
}

bot.on("ready", () => {
	console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
	setTimeout(game1, 10000);
});

bot.login(require("./token.json").token);