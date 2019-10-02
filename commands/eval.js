const config = require ("../config.js");

exports.run = (client, message) => {

	const clean = text => {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	};

	const args = message.content.split(" ").slice(1);

	let logChannel = client.channels.get("549937681451188234");

	if (message.content.startsWith(config.prefix + "eval")) {
		if (message.author.id !== config.ownerID) return message.react("⛔") & logChannel.send(":lock: " + message.author.toString() + " has attempted to use eval whilst unauthorized.");
		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			message.channel.send(clean(evaled), {code:"xl"});
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}

};

exports.help = {
	name:"eval"
};