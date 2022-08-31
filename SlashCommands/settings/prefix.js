const prefixSchema = require('../../models/prefix');
let {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
	Permissions,
	CommandInteraction
} = require("discord.js")

module.exports = {
	name: "prefix",
	description: "Change server prefix",
	userPerms: ["ADMINISTRATOR"],
	botPerms: ["ADMINISTRATOR"],
	options: [{
		name: 'prefix',
		type: 'STRING',
		description: 'prefix to change to',
		required: true
	}, ],
	run: async (client, interaction, args) => {

		const prefix = interaction.options.getString("prefix");

		if (prefix.length > 3) return interaction.reply({
			embeds: [errEmbed.setDescription(`**Prefix can't be longer than 3 characters**`)]
		})

		prefixSchema.findOne({
			Guild: interaction.guild.id
		}, async (err, data) => {
			if (err) throw err;

			if (data) {
				data.delete()
				return interaction.reply({
					embeds: [errEmbed.setDescription(`**Server prefix has been reset to \`\`\`>\`\`\`**`)]
				})
			}
			if (!data) {
				data = new prefixSchema({
					Guild: interaction.guild.id,
					Prefix: prefix
				})
				data.save()
				interaction.reply({
					embeds: [errEmbed.setDescription(`Custom prefix in this server is now set to \`\`\`${prefix}\`\`\``)]
				})
			}
		})
	}

},
};