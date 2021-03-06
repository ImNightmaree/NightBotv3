const Discord = require("discord.js")
const config = require("../config")
const guildMod = "549215227514847232"

exports.run = async (client, message) => {

	const helpSentEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I've got a lot of commands, so I've sent them to you in DM's. Not received it? Make sure you've got your DM's open or I can't message you.")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp()

	message.channel.send(helpSentEmbed)

	const commandStaffEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("**" + config.prefix + "ban** @user reason - Permanently ban a user from the server.\n\n" +
			"**" + config.prefix + "kick** @user reason - Kick a person from the server.\n\n" +
			"**" + config.prefix + "mute** @user - Mute a user from the server. Run the command again to unmute.\n\n" +
			"**" + config.prefix + "purge** amount - Purge a certain amount of messages from the channel. *You must ensure your purging more than 2 messages, but less than 100 at a time.*\n\n" +
			"**" + config.prefix + "uptime** - See how long the bot's been running for.\n\n" +
			"**" + config.prefix + "ping** - See if the bot is responding properly, and what the ping is between the WebSocket and the client.\n\n" +
			"**" + config.prefix + "restart** - Force the bot to restart. It should usually reboot in about a minute or two.\n\n" +
			"**" + config.prefix + "thunderdome** challenge @user/rules/winner @user - Welcome to the thunderdome... the rules command doesn't require a user to be mentioned. You can only perform the winner subcommand if your a judge.")
		.setFooter("Need more help? Ask in the Discord!")
		.setTimestamp()

	const commandEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("**" + config.prefix + "uptime** - See how long the bot's been running for.\n\n" +
						"**" + config.prefix + "ping** - See if the bot is responding properly, and what the ping is between the WebSocket and the client.\n\n" +
						"**" + config.prefix + "thunderdome** challenge @user/rules - Welcome to the thunderdome... the rules command doesn't require a user to be mentioned.")
		.setFooter("Need more help? Ask in the Discord!")
		.setTimestamp()

	if (message.member.roles.has(guildMod)) {
		await message.author.send(commandStaffEmbed)
	} else {
		await message.author.send(commandEmbed)
	}
}

exports.help = {
	name:"help"
}