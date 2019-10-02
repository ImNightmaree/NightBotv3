const Discord = require("discord.js");
const config = require("../config");

exports.run = (client, message) => {

	const mutedRole = message.guild.roles.get("549215227514847232");
	const mutedRole2 = "549215227514847232";
	const guildMod = "549215227514847232";
	const logChannel = client.channels.get("549937681451188234");

	let member = message.mentions.members.first();

	if (!message.member.roles.has(guildMod)) return message.react("⛔")
		&& logChannel.send("🗯 " + message.author.toString() + " has attempted to mute " + member + " unsuccessfully, as they didn't have permission.");

	const unmuteSuccessEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I have successfully un-muted " + member + ".")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	if (member.roles.has(mutedRole2)) {

		member.removeRole(mutedRole).catch().then();
		{
			return logChannel.send("🗯 " + message.author.toString() + " has successfully un-muted " + member + ".")
				&& message.channel.send(unmuteSuccessEmbed)
		}

	}

	const muteSuccessEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I have successfully muted " + member + ". When you want them unmuted, please re-run the command again.")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	member.addRole(mutedRole).catch(console.error).then();
	{
		message.channel.send(muteSuccessEmbed);
		logChannel.send("🔇 " + message.author.toString() + " has successfully muted " + member + ".")
	}

};


exports.help = {
	name:"mute"
};