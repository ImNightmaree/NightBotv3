const Discord = require("discord.js");
const config = require("../config");


exports.run = async (client, message, args) => {

	let logChannel = client.channels.get("549937681451188234");
	const guildMod = "549215227514847232";
	const purgeCount = parseInt(args[0], 10);

	if (!message.member.roles.has(guildMod)) {
		return message.react("⛔")
			&& logChannel.send("📔 " + message.author.toString() + " has attempted to purge " + message.channel.toString() + " of " + purgeCount + " messages whilst unauthorized.");

	}

	message.delete()

	const toBePurged = await message.channel.fetchMessages({limit: purgeCount +1});
	message.channel.bulkDelete(toBePurged)
		.catch(error => console.log(error));

	const purgeCompleteEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I have successfully purged " + purgeCount + " messages from " + message.channel.toString())
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	message.channel.send(purgeCompleteEmbed)
	logChannel.send("📔 " + message.author.toString() + " has successfully purged " + purgeCount + " messages from " + message.channel.toString())

}

exports.help = {
	name:"purge"
};