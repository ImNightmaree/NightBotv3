const Discord = require("discord.js");
const config = require("../config");


exports.run = async (client, message, args) => {

	let logChannel = client.channels.get("549937681451188234");
	let listChannel = client.channels.get("623488011971330058");
	const guildMod = "549215227514847232";
	const target = message.mentions.members.first();

	if (!message.member.roles.has(guildMod)) {
		return message.react("⛔")
			&& logChannel.send("\n" + "📝 " + message.author.toString() + " has attempted to ban " + target + " whilst unauthorized.");
	}

	if (!target) {

		const targetNotExistEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("I'm not able to ban this user.\n\nAre you mentioning a valid user?")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp();

		return message.channel.send(targetNotExistEmbed);
	}

	if (!target.bannable) {

		const cannotBanEmbed = new Discord.RichEmbed()
			.setColor(config.embedColor)
			.setDescription("I'm not able to ban this user.\n\nThey might have a higher role than I do, or I no longer have permissions to ban.")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp();

		return message.channel.send(cannotBanEmbed)
			&& logChannel.send("\n" + "📝" + message.author.toString() + " has attempted to ban " + target + " but the command failed, as the target was unbannable.");

	}

	let reason = args.slice(1).join(' ');

	if (!reason){

		reason = "No reason provided. Please ask issuing staff member for details."; }

	await client.users.get(target.id).send("Hi there! I'm DMing you to inform you that " + message.author.username + "#" + message.author.discriminator + " has issued a permanent ban on you for the reason of '" + reason + "' For any questions, please contact them.");

	await target.ban("(" + message.author.username + "#" + message.author.discriminator + "): " + reason)
		.catch(error => console.log(error));

	const banSuccessEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("I've successfully issued a ban!")
		.addField("User: ", target)
		.addField("Reason: ", reason)
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();

	message.channel.send(banSuccessEmbed);
	logChannel.send("\n" + "📝 " + message.author.toString() + " has successfully banned " + target + " for the reason of '" + reason + "'");

	const banLoggingEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("A new ban has been added. In the event that the ban is appealed or otherwise removed, a member of staff will remove this message.")
		.addField("User: ", target)
		.addField("Reason: ", reason)
		.addField("Issued by: ", message.author.toString())
		.setTimestamp();

	listChannel.send(banLoggingEmbed)
};

exports.help = {
	name:"ban"
};