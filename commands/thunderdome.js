const Discord = require("discord.js")
const config = require("../config")

const challenged = message.mentions.members.first()

exports.run = (client, message, args) => {

	message.channel.send("Please provide an argument. Struggling? Please refer to my help page! (" + config.prefix + "help" + ")")

	const thunderdomeChallengeEmbed = new Discord.RichEmbed()
		.setTitle("Thunderdome")
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(config.embedColor)
		.setDescription("You've challenged " + challenged + "! Will they accept the challenge..?")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp()

	if (args[0] === "challenge" && args[1].contains(message.mentions)) {

		message.channel.send(thunderdomeChallengeEmbed)

	}



}

exports.help = {
	name:"thunderdome"
}