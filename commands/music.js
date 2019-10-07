const ytdl = require("ytdl-core")

exports.run = async (client, message, args) => {

	if (args[0] === "play") {
		if (!message.member.voiceChannel) { // If member isn't in a voice channel.
			return message.channel.send("I can't play music in a voice channel that you aren't currently in.\n\nPlease join a voice channel and try again.")
		}
		if (message.guild.me.voiceChannel) { // If bot is currently in a voice channel.
			return message.channel("I'm already in a voice channel - sadly I can't be in two places at once!\n\nPlease either disconnect me from my current channel and try again, or move me.")
		}
		if (!args[1] || !args[1].includes("youtube.com" || !args[1].includes("youtu.be"))) { // If there aren't any arguments for the second position, or if it doesn't contain youtube.
			return message.channel.send("You haven't provided a URL to play!\n\nPlease provide a proper URL and try again.")
		}

		const validationCheck = await ytdl.validateURL(args[1])

		if (!validationCheck) {
			return message.channel.send("You haven't provided a URL to play!\n\nPlease provide a proper URL and try again.")
		}

		const videoInfo = await ytdl.getInfo(args[1])
		const connection = await message.member.voiceChannel.join()
		const dispatcher = await connection.playStream(ytdl(args[1], { filter: "audioonly"}))
		message.channel.send("We're now playing **" + videoInfo.title + "** requested by " + message.author. + " in **" + message.member.voiceChannel.name + "**!")

	}

	if (args[0] === "leave") {

		if (!message.guild.me.voiceChannel) {
			return message.channel.send("I'm not currently in a voice channel...")
		}
		if (message.member.voiceChannelID !== message.guild.me.voiceChannelID) {
			return message.channel.send("You can't tell me to leave a voice channel that you aren't in...")
		}
		if (!message.member.voiceChannel) {
			return message.channel.send("Please connect to my voice channel before telling me to leave...")
		}

		message.guild.me.voiceChannel.leave()
		message.channel.send("I'm out, later losers!")
	}




}

exports.help = {
	name:"music"
}