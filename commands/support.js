const Discord = require("discord.js");
const config = require("../config");

exports.run = (client, message) => {

	const supportEmbed = new Discord.RichEmbed()
		.setColor(config.embedColor)
		.setDescription("Need Help & Support? You can find the links to the appropriate area below!" + "\n\n" +
			"If posting in Admin/Superadmin Support, your thread will only be visible to you and the relevant team. " +
			"Please don't use those forums for protesting a ban or staff abuse - those should be kept to The Courthouse, or you can speak to a SA/HR.")
		.addField("General Help & Support",   "https://arcadiastudios.co.uk/forumdisplay.php?fid=13", inline=true)
		.addField("Admin Support", "https://arcadiastudios.co.uk/forumdisplay.php?fid=14", inline=true)
		.addField("Superadmin Support", "https://arcadiastudios.co.uk/forumdisplay.php?fid=15")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp();


	message.channel.send(supportEmbed);

};

exports.help = {
	name:"support"
};