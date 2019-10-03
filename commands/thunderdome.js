const Discord = require("discord.js")
const config = require("../config")



exports.run = (client, message, args) => {

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

	}



}

exports.help = {
	name:"thunderdome"
}