const Discord = require("discord.js")
const config = require("../config")



exports.run = async (client, message, args) => {

	const challenged = message.mentions.members.first()

	if (!args) {
		message.channel.send("Please provide an argument. Struggling? Please refer to my help page! (" + config.prefix + "help" + ")")
	}

	const thunderdomeChallengeEmbed = new Discord.RichEmbed()
		.setTitle("Thunderdome")
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(config.embedColor)
		.setDescription("You've challenged " + challenged + "! Will they accept the challenge..?")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp()

	if (args[0] === "challenge" && message.mentions.members.first()) {

		message.channel.send(thunderdomeChallengeEmbed)
		await message.react("✅")
		await message.react("❎")
	}

	const acceptFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id !== config.botID
	const denyFilter = (reaction, user) => reaction.emoji.name === "❎" && user.id !== config.botID

	acceptFilter.on("collect", () => message.channel.send(challenged.toString + " has accepted the challenge! Let the battle commence! You can roast once every 30 seconds, and this continues until a judge decides the winning roast. With that said, begin!"))
	denyFilter.on("collect", () => message.channel.send(challenged.toString() + " is too chicken and has bailed from the challenge... pussy. Try challenging someone else! Maybe they'll live up to the challenge..."))
}

exports.help = {
	name:"thunderdome"
}