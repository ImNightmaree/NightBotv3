const ytdl = require("ytdl-core")
const musicQueue = new Map()

exports.run = async (client, message, args) => {

	if (args[0] === "play") {
		if (!message.member.voiceChannel) { // If member isn't in a voice channel.
			return message.channel.send("I can't play music in a voice channel that you aren't currently in.\n\nPlease join a voice channel and try again.")
		}
		if (!args[1]) { // If there aren't any arguments for the second position.
			return message.channel.send("You haven't provided a URL to play!\n\nPlease provide a proper URL and try again.")
		}

		const validationCheck = await ytdl.validateURL(args[1])

		if (!validationCheck) {
			return message.channel.send("You haven't provided a URL to play!\n\nPlease provide a proper URL and try again. We only support YouTube at this time.")
		}

		const videoInfo = await ytdl.getInfo(args[1])
		const data = musicQueue.get(message.guild.id) || {}

		if (!data.connection) data.connection = await message.member.voiceChannel.join() // If we don't have a connection, let' start one.
		if (!data.queue) data.queue = [] // If there isn't an array for our queue, then let's make one.
		data.guildID = message.guildID

		data.queue.push({ // Let's add it to the queue.
			songTitle: videoInfo.title,
			requester: message.author.tag,
			url: args[1]
		})

		if (!data.dispatcher) await play(client, data) // If there's no dispatcher, let's make one and play the song.
		else {
			message.channel.send(message.author.tag + " has added " + videoInfo.title + " to the queue!")
		}
		musicQueue.set(message.guild.id, data)

		async function play(client, data) {
			client.channels.get(message.channel.send("We're now playing **" + data.queue[0].songTitle + "** requested by **" + data.queue[0].requester + "**!"))
			data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: "audioonly" }))
			console.log("[music.js] Playing audio: " + data.queue[0].songTitle)
			data.dispatcher.guildID = data.guildID

			data.dispatcher.once("finish", function(){
				finish(client, this)
			})
		}

		async function finish(client, dispatcher) {
			console.log("[music.js] We've finished! Time to shift to the next...")
			const fetched = musicQueue.get(dispatcher.guildID)
			console.log("We've got a dispatcher in GuildID: " + fetched)
			fetched.queue.shift()
			console.log("[music.js] Shifted!")
			if (fetched.queue.length > 0) { // Is the queue empty?
				musicQueue.set(dispatcher.guildID, fetched) && console.log("[music.js] Set: " + dispatcher.guildID + " & " + fetched)
				await play(client, fetched) && console.log("[music.js] Playing...")
			} else {
				musicQueue.delete(dispatcher.guildID)
				const vc = message.guild.me.voiceChannel
				if (vc) await vc.leave()
			}
		}
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

		await message.guild.me.voiceChannel.leave()
		message.channel.send("I'm out, later losers!")
	}




}

exports.help = {
	name:"music"
}