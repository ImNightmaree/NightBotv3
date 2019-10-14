
const ytdl = require("ytdl-core")

exports.run = async (client, message, args, ops) => {

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
		let info = await ytdl.getInfo(args[1])
		let data = ops.active.get(message.guild.is) || {}

		if (!data.connection) data.connection = await message.member.voiceChannel.join() // No connection? Let's make one now!
		if (!data.queue) data.queue = [] // No queue array? Let's make one now!
		data.guildID = message.guild.id

		data.queue.push({
			songTitle: info.title,
			requester: message.author.tag,
			url: args[1],
			announceChannel: message.channel.id
		})

		if (!data.dispatcher) await play(client, ops, data) // No dispatcher? Play!
		else {
			message.channel.send("I've added **" + info.songTitle + "** to the queue, requested by **" + message.author.tag + "**")
		}

		ops.active.set(message.guild.id, data)

		async function play(client, ops, data) {
			client.channels.get(data.queue[0].announceChannel).send("We're now playing **" + data.queue[0].songTitle + "**, requested by **" + data.queue[0].requester + "**")
			data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly'}))
			data.dispatcher.guildID = data.guildID

			data.dispatcher.once("end", function() {
				console.log("We've finished!")
				finish(client, ops, data)
			})
		}

		async function finish(client, ops, dispatcher) {
			let fetched = ops.active.get(dispatcher.guildID)
			fetched.queue.shift()
			if (fetched.queue.length > 0) {
				ops.active.set(dispatcher.guildID, fetched)
				await play(client, ops, fetched)
			} else {
				ops.active.delete(dispatcher.guildID)
				let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel
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

		message.guild.me.voiceChannel.leave()
		message.channel.send("I'm out, later losers!")
	}




}

exports.help = {
	name:"music"
}