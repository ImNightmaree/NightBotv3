const Discord = require("discord.js")
const config = require("../config")
const db = require("better-sqlite3")("./thunderdome.db")


exports.run = async (client, message, args) => {

	const challenged = message.mentions.members.first()
	const judgeRole = "553371407107751950"

	if (!args) {
		message.channel.send("Please provide an argument. Struggling? Please refer to my help page! (" + config.prefix + "help" + ")")
	}

	if (args[0] === "rules") {

		const thunderdomeRulesEmbed = new Discord.RichEmbed()
			.setAuthor(client.user.username, client.user.avatarURL)
			.setColor(config.embedColor)
			.setDescription("Welcome to The Thunderdome! The rules here are as follows...")
			.addField("Rule 1)", "You can only send one roast per 30 seconds.")
			.addField("Rule 2)", "Don't base your roasts off real life information.")
			.addField("Rule 3)", "Don't use images. Especially if they're of your opponent.")
			.addField("Rule 4)", "If someone forfeits, the match is over. No exceptions.")
			.addField("Rule 5)", "The system is turn-based. Take turns and don't message twice in one go. Wait for your opponent. *If it's taking too long, a Judge can declare a winner.*")
			.addField("Rule 6)", "Grammar is encouraged but not required. The more creative and spicy your roasts are, the better.")
			.addField("Rule 7)", "If you lose five times in a row, you'll be given the role of 'The Soiled Fool' for a week. Win once and you get it removed, just consider yourself lucky.")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp()

		await message.author.send(thunderdomeRulesEmbed)
		message.channel.send("I've sent the rules to you by DM. Haven't got it? Make sure you've got your privacy settings to allow DM's from server members.")

	}

	const thunderdomeChallengeEmbed = new Discord.RichEmbed()
		.setTitle("Thunderdome")
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(config.embedColor)
		.setDescription("You've challenged " + challenged + "! Will they accept the challenge..?")
		.setFooter("Called by " + message.author.tag, message.author.avatarURL)
		.setTimestamp()

	if (args[0] === "challenge" && message.mentions.members.first()) {

		message.channel.send(thunderdomeChallengeEmbed)
			.then(async function (message) {

				await message.react("✅")

				const acceptFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id !== config.botID && user.id === challenged.id
				const acceptCollector = message.createReactionCollector(acceptFilter, { time: 300000})

				acceptCollector.on("collect", () => message.channel.send("The challenged has accepted! Let the battle commence! You can roast once every 30 seconds, and this continues until a judge decides the winning roast. With that said, begin!"))
				acceptCollector.on("end", () => message.channel.send("The challenge request has expired as the challenged person failed to respond within 5 minutes... try again later, maybe then they won't be so much of a pussy."))
			})

	}

	if (args[0] === "winner" && message.mentions.members.first() && !message.member.roles.has(judgeRole)) {
		message.author.send("You can't declare a winner because you aren't a Judge.")
	}

	if (args[0] === "winner" && !message.mentions.members.first() && message.member.roles.has(judgeRole)) {
		message.author.send("You haven't mentioned a user to declare winner.")
	}

	if (args[0] === "winner" && message.mentions.members.first() && message.member.roles.has(judgeRole)) {
		const grabPoints = db.prepare('SELECT points FROM users WHERE id = ?')
		const result = grabPoints.get(message.mentions.members.first().id)
		console.log("[Thunderdome] Points: " + result.points)

		const updatePoints = db.prepare("UPDATE users SET points = ? WHERE id = ?")

		const parsedResult = parseInt(result.points, 10)

		updatePoints.run(parsedResult+1, message.mentions.members.first().id)

		message.react("👍")
	}

	if (args[0] === "leaderboard") {
		const grabFirstUser = db.prepare("SELECT username FROM users ORDER BY points DESC")
		const grabFirstPoint = db.prepare("SELECT points FROM users ORDER BY points DESC")
		const firstResultUser = grabFirstUser.get()
		const firstResultPoint = grabFirstPoint.get()
		const firstPlaceUser = firstResultUser.username
		const firstPlacePoint = firstResultPoint.points

		const grabSecondUser = db.prepare("SELECT username FROM users ORDER BY points DESC LIMIT 1,1")
		const grabSecondPoint = db.prepare("SELECT points FROM users ORDER BY points DESC LIMIT 1,1")
		const secondResultUser = grabSecondUser.get()
		const secondResultPoint = grabSecondPoint.get()
		const secondPlaceUser = secondResultUser.username
		const secondPlacePoint = secondResultPoint.points

		const grabThirdUser = db.prepare("SELECT username FROM users ORDER BY points ASC")
		const grabThirdPoint = db.prepare("SELECT username FROM users ORDER BY points ASC")
		const thirdResultUser = grabThirdUser.get()
		const thirdResultPoint = grabThirdPoint.get()
		const thirdPlaceUser = thirdResultUser.username
		const thirdPlacePoint = thirdResultPoint.points

		const thunderdomeLeaderboardEmbed = new Discord.RichEmbed()
			.setTitle("Top 3")
			.setAuthor(client.user.username, client.user.avatarURL)
			.setColor(config.embedColor)
			.addField("In first place...", firstPlaceUser + "(" + firstPlacePoint + " wins overall)")
			.addField("In second place...", secondPlaceUser + "(" + secondPlacePoint + " wins overall)")
			.addField("In third place...", thirdPlaceUser + "(" + thirdPlacePoint + " wins overall)")
			.setFooter("Called by " + message.author.tag, message.author.avatarURL)
			.setTimestamp()

		message.channel.send(thunderdomeLeaderboardEmbed)
	}

}

exports.help = {
	name:"thunderdome"
}