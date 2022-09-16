const {
	Client,
	Collection,
	MessageEmbed
} = require("discord.js");

const client = new Client({
	intents: 32767,
	restTimeOffset: 0,
	allowedMentions: {
		parse: ["roles", "users"],
		repliedUser: false
	}
});

let errChannel = "Your logs channel id";

module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.emo = require("./emojis");

require("./handler")(client);

let toJSON = require("@stdlib/error-to-json");

process.on("unhandledRejection", (reason, p) => {
	let error = toJSON(reason);
	console.log(reason);
	let embed = new MessageEmbed()
		.setAuthor(`${error.name}`, client.user.displayAvatarURL({
			dynamic: true
		}))
		.setTitle(`unhandledRejection`)
		.setDescription(`\`\`\`js\n${error.stack}\`\`\``)
		.addField(
			`Reason:`,
			`\`\`\`cs\n# ${error.message}\n(code: ${error.code})\n\`\`\``,
			true
		)
		.addField(`Path:`, `\`\`\`bash\n# ${error.path}\n\`\`\``, true)
		.setTimestamp()
		.setColor("#6F8FAF")
		.setFooter(`httpStatus: ${error.httpStatus}`);
	client.channels.cache.get(errChannel).send({
		embeds: [embed]
	})

});

process.on("uncaughtException", (err, origin) => {
	console.log(err, origin);
	let embed = new MessageEmbed()
		.setAuthor(
			`${client.user.username} Error Catcher`,
			client.user.displayAvatarURL({
				dynamic: true
			})
		)
		.setTitle(`uncaughtException`)
		.addField(`Error:`, `\`\`\`js\n${err}\n\`\`\``)
		.setTimestamp()
		.setColor("#6F8FAF")
		.setFooter(`[ AntiCrash ]`);
	client.channels.cache.get(errChannel).send({
		embeds: [embed]
	});
});

process.on("multipleResolves", (type, promise, reason) => {
	console.log(type, promise, reason);
	let embed = new MessageEmbed()
		.setAuthor(
			`${client.user.username} Error Catcher`,
			client.user.displayAvatarURL({
				dynamic: true
			})
		)
		.setTitle(`uncaughtException`)
		.addField(`Reason:`, `\`\`\`js\n${reason}\n\`\`\``)
		.addField(`Type:`, `\`\`\`js\n${type}\n\`\`\``)
		.setTimestamp()
		.setColor("#6F8FAF")
		.setFooter(`[ AntiCrash ]`);
	client.channels.cache.get(errChannel).send({
		embeds: [embed]
	});
});

client.login("Your Token");
