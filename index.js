require('dotenv').config({path: __dirname + '/.env'})

const config = require("./config.js")
const SQLite = require("better-sqlite3")
const db = new SQLite("../thunderdome.db")
const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()

client.commands = new Discord.Collection()

let cooldown = new Set()
let cooldownSeconds = 5


//Checks to see if there are any command files located at  ./commands/.

fs.readdir("./commands/", (err, files) => {

	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0){
		console.log("Couldn't find commands.");
		return;
	}

	jsfile.forEach((f) =>{
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		client.commands.set(props.help.name, props);
	});
});

// Initiate the process of loading the client

let statusList = ['beer pong with Night and Jester...', "with Jester's shining forehead...", "with Night's code...", "with your mind..."]

client.on("ready", async () => {

	setInterval(function() {

		let status = statusList[Math.floor(Math.random()*statusList.length)]
		client.user.setPresence({ game: { name: status }, status: 'online'})}, 15000)

	let date = new Date()

	console.log("")
	console.log("["+ date + "] Ricky is online on " + client.guilds.size + " servers, and is able to see " + client.channels.size + " channels. We currently serve " + client.users.size + " users.\n")

	console.log("Servers:")
	client.guilds.forEach((guild) => {
		console.log("\n - " + guild.name + " (" + guild.id + ") " + "Owner: " + guild.ownerID)

		guild.channels.forEach((channel) => {
			console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
		})
	})
	console.log("\nThe current prefix is set to " + config.prefix + ". Need to change it? Update in the .env file.")

})

client.on("guildCreate", guild => {
	console.log("Guild " + guild.name + " (" + guild.id + " owned by " + guild.ownerID + ") " + " has added to me to their server.")

})

client.on("guildMemberAdd", member => {
	console.log("[guildMemberAdd] Received!")

	console.log("Detected member has joined. Creating their table now.")
	const createRow = db.prepare("INSERT INTO users (id, username, points) VALUES (?), (?), 0")
	createRow.run(member.id, member.toString())
})

client.on("guildDelete", guild => {
	console.log("Guild " + guild.name + " (" + guild.id + ") " + "has removed me from their server.")

})

// Loading the client, including the commands
client.on("message", async message => {

	if (message.author.bot) return // Don't respond to any messages from a bot.
	if (message.channel.type === "dm") return message.channel.send("Please issue any commands to me in a server. I don't support DM communications just yet!") // We don't support DM communication.

	if (message.content.toLowerCase().includes("discord.gg") && !message.member.hasPermission("ADMINISTRATOR")) { // If contains discord.gg and doesn't have admin perms.
		let authorID = message.author.id
		message.delete()
		console.log("[index.js] Message removed by " + message.author.toString() + " as it contained the beginning of an invite link.")
		message.channel.send("Naughty, naughty " + message.author.toString() + "! You can't be sharing invite links!")
		await client.users.get(authorID).send("Sorry, but invite links can't be shared without permission from the owners. Your message has been deleted.")
	}

	if (!message.content.startsWith(config.prefix)) return // If it doesn't have a prefix by this point, ignore it.
	if (cooldown.has(message.author.id)) { // If the user has a cooldown, warn them and ignore it.
		message.delete()
		client.channels.get("549937681451188234").send(":warning: " + message.author.toString() + " has hit cooldown.")
		return message.channel.send("Hey " + message.author.toString() + "! Please wait for 5 seconds before sending a command.")

	}
	if (!message.member.hasPermission("ADMINISTRATOR")) { // If the person isn't an Administrator, add a cooldown for bot commands.
		cooldown.add(message.author.id)

	}

	setTimeout(() => {
		cooldown.delete(message.author.id)
	}, cooldownSeconds * 1000)

	let messageArray = message.content.split(" ")
	let cmd = messageArray[0]
	let args = messageArray.slice(1)

	let commandfile = client.commands.get(cmd.slice(config.prefix.length))
	if (commandfile) commandfile.run(client, message, args)

})
client.login(config.token)