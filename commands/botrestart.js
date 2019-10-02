const Discord = require("discord.js")
const config = require("../config")
const guildMod = "549215227514847232"

exports.run = (client, message) => {

	let logChannel = client.channels.get("549937681451188234")

	function resetNightBot(channel) {

		const rebootEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("I'm restarting now! See you soon!")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp()

		if (!message.member.roles.has(guildMod)) {
			message.react("⛔");
			logChannel.send(":satellite: " + message.author.toString() + " attempted to restart the bot whilst unauthorized.")
			return
		}

		channel.send(rebootEmbed)
			.then(() => client.destroy())
			.then(() => client.login(process.env.TOKEN)) && console.log("[botrestart.js] Restart successful.")
	}

	resetNightBot(message.channel)

};

exports.help = {
	name:"restart"
}