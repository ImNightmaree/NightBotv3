const Discord = require("discord.js")
const ytdl = require("ytdl-core")
const ytdlDisc = require("ytdl-core-discord")

exports.run = async (client, message, args) => {

	if (args[0] === "play") {
		const { voiceChannel } = message.member
		if (!voiceChannel) {
			return message.channel.send("You need to be in a voice channel to play music.")
		}
		const permissions = voiceChannel.permissionsFor(message.client.user)
		if (!permissions.has("CONNECT")) {
			return message.channel.send("I'm not able to connect to this channel as I lack the permission to do so.")
		}
		if (!permissions.has("SPEAK")) {
			return message.channel.send("I'm not able to speak in this channel as I lack the permission to do so.")
		}
		const validated = await ytdl.validateURL(args[1])
		if (!validated) {
			return message.channel.send("The URL provided isn't valid - is it from YouTube? (we only support YouTube at this time)")
		}

		const musicQueue = message.client.queue.get(message.guild.id)
		const songInfo = await ytdl.getInfo(args[1])
		const song = {
			id: songInfo.video_id,
			title: Discord.escapeMarkdown(songInfo.title),
			url: songInfo.video_url
		}
		if (musicQueue) { // Does our queue exist?
			musicQueue.songs.push(song)
			console.log("[music.js] Queue: " + musicQueue.songs)
			return message.channel.send(song.title + " has been added to the queue! Requested by " + message.author.tag)
		}
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		}
			message.client.queue.set(message.guild.id, queueConstruct)
		queueConstruct.songs.push(song)

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id)
			if (!song) {
				queue.voiceChannel.leave()
				message.client.queue.delete(message.guild.id)
				return
			}
		}

		const dispatcher = queue.connection.playOpusStream(await ytdlDisc(song.url), { passes: 3})
			.on("end", reason => {
				if (reason === "Stream is not generating quickly enough.") console.log("[music.js] Song ended with reason: Stream not generating quickly enough.")
				else console.log("[music.js] Song ended with reason: " + reason)
				queue.songs.shift()
				play(queue.songs[0])
			})
			.on("error", error => console.log("[music.js] Error encountered: " + error))
		dispatcher.setVolumeLogarithmic(queue.volume / 5)
		queue.textChannel.send("Now playing: " + song.title + " requested by **" + message.author.tag + "**")

		try {
			const connection = await voiceChannel.join()
			queueConstruct.connection = connection
			play(queueConstruct.songs[0])
		} catch (error) {
			console.error(`[music.js] Couldn't join voice channel: ${error}`)
			message.client.queue.delete(message.guild.id)
			await voiceChannel.leave()
			return message.channel.send("I wasn't able to join the voice channel because an error occurred.")
		}

	}

}

exports.help = {
	name:"music"
}