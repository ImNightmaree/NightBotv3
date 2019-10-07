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
		message.channel.send("We're now playing **" + videoInfo.title + "** requested by " + message.author.toString + " in **" + message.member.voiceChannel.name + "**!")

	}




}

exports.help = {
	name:"music"
}