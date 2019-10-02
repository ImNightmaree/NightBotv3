const Discord = require("discord.js")
const config = require("../config")

exports.run = (client, message) => {

	const pingEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("The current ping seems to be...")
		.addField("Websocket", client.ping + "ms")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp()


	message.channel.send(pingEmbed)

}

exports.help = {
	name:"ping"
}