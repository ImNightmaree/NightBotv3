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

	if (purgeCount <2 || purgeCount >100) {

		const invalidArgsEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("Please provide a number between 2 and 100 for the number of messages to be purged.")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp();

		return message.send(invalidArgsEmbed)
	}

	message.delete()

	const toBePurged = await message.channel.fetchMessages({limit: purgeCount});
	message.channel.bulkDelete(toBePurged)
		.catch(error => console.log(error));

	const purgeCompleteEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I have successfully purged " + purgeCount + " messages from " + message.channel.toString())
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	message.channel.send(purgeCompleteEmbed);
	logChannel.send("📔 " + message.author.toString() + " has successfully purged " + purgeCount + " messages from " + message.channel.toString())

};

exports.help = {
	name:"purge"
};