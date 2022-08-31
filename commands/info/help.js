const {
	MessageEmbed,
	MessageActionRow,
	MessageButton
} = require("discord.js");
const {
	readdirSync
} = require("fs");
const prefix = require('../../models/prefix');
module.exports = {
	name: 'help',
	aliases: ["h"],
	description: 'Get some help',
	usage: '<command name>',
	run: async (client, message, args) => {

		let custom;

		const data2 = await prefix.findOne({
				Guild: message.guildId
			})
			.catch(err => console.log(err))

		if (data2) {
			custom = data2.Prefix;
		}
		if (!data2) {
			const prefix = "$"
			custom = prefix
		}

		if (!args[0]) {

			let categories = [];

			readdirSync("./commands/").forEach((dir) => {
				const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
					file.endsWith(".js")
				);

				const cmds = commands.map((command) => {
					let file = require(`../../commands/${dir}/${command}`);

					if (!file.name) return "No command name.";

					let name = file.name.replace(".js", "");

					return `\`${name}\``;
				});

				let data = new Object();

				data = {
					name: dir.toUpperCase(),
					value: cmds.length === 0 ? "In progress." : cmds.join(" "),
				};

				categories.push(data);
			});

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
					.setLabel('Invite Me')
					.setStyle('LINK')
					.setURL('your bot invite'),
					new MessageButton()
					.setLabel('Support Server')
					.setStyle('LINK')
					.setURL('https://discord.gg/j3YamACwPu'),
				);

			const embed = new MessageEmbed()
				.setTitle(`${client.emojis.happy} | Need help? here are all my commands\nPrefix: ${custom}`)
				.addFields(categories)
				.setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({
					dynamic: true
				})})
				.setTimestamp()
				.setColor("#6F8FAF")
			return message.reply({
				embeds: [embed],
				components: [row]
			});
		} else {
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

			if (!command) {
				const embed = new MessageEmbed()
					.setTitle(`Invalid Command! Use \`${custom}help\` For All Of My Commands!`)
					.setColor("#6F8FAF");
				return message.reply({
					embeds: [embed]
				});
			}

			const embed = new MessageEmbed()
				.setTitle("Command Details:")
				.addField("PREFIX:", `\`${custom}\``)
				.addField("COMMAND:", command.name ? `\`${command.name}\`` : "No Name For This Command.")
				.addField("ALIASES:", command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases For This Command.")
				.addField("USAGE:", command.usage ? `\`${custom}${command.name} ${command.usage}\`` : `\`${custom}${command.name}\``).addField("DESCRIPTION:", command.description ? command.description : "No Description For This Command.")
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
					dynamic: true
				}))
				.setTimestamp()
				.setColor("#6F8FAF");
			return message.reply({
				embeds: [embed]
			});
		}
	},
};
