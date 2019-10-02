const Discord = require("discord.js");
const config = require("../config");


exports.run = async (client, message, args) => {

	let logChannel = client.channels.get("549937681451188234");
	let listChannel = client.channels.get("623488011971330058");
	const guildMod = "549215227514847232";
	const target = message.mentions.members.first();

	if (!message.member.roles.has(guildMod)) {
		return await message.react("⛔")
			&& logChannel.send("\n" + "📝 " + message.author.toString() + " has attempted to kick " + target + " whilst unauthorized.");
	}

	if (!target) {

		const targetNotExistEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("I'm not able to kick this user.\n\nAre you mentioning a valid user?")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp();

		return message.channel.send(targetNotExistEmbed);
	}

	if (!target.kickable) {

		const cannotKickEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("I'm not able to kick this user.\n\nThey might have a higher role than I do, or I no longer have permissions to kick.")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp();

		return message.channel.send(cannotKickEmbed)
			&& logChannel.send("\n" + "📝" + message.author.toString() + " has attempted to kick " + target + " but the command failed, as the target was unkickable.");

	}

	let reason = args.slice(1).join(' ');

	if (!reason){

		reason = "No reason provided. Please ask issuing staff member for details."; }

	await client.users.get(target.id).send("Hi there! I'm DMing you to inform you that " + message.author.username + "#" + message.author.discriminator + " has kicked you for the reason of '" + reason + "' For any questions, please contact them. You're free to rejoin whenever you feel ready.");

	await target.kick("(" + message.author.username + "#" + message.author.discriminator + "): " + reason)
		.catch(error => console.log(error));

	const kickSuccessEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I've successfully kicked someone!")
		.addField("User: ", target)
		.addField("Reason: ", reason)
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	message.channel.send(kickSuccessEmbed);
	logChannel.send("\n" + "📝 " + message.author.toString() + " has successfully kicked " + target + " for the reason of '" + reason + "'");

	const kickLoggingEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("A kick has been made. Please see below for details.")
		.addField("User: ", target)
		.addField("Reason: ", reason)
		.addField("Issued by: ", message.author.toString())
		.setTimestamp();

	listChannel.send(kickLoggingEmbed)
};

exports.help = {
	name:"kick"
};