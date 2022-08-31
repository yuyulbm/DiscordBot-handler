const client = require("../index");
const {
	MessageEmbed,
	Permissions,
	MessageActionRow,
	MessageButton
} = require("discord.js")
const cooldownSchema = require("../models/cooldown")
const prettyMilliseconds = require('pretty-ms');
const owners_id = ["748597084134834186"];
const prefix = require('../models/prefix');

client.prefix = async function(message) {
	let custom;
	const data = await prefix.findOne({
		Guild: message.guildId
	}).catch(err => console.log(err))
	if (data) {
		custom = data.Prefix;
	}
	if (!data) {
		const prefix = '>'
		custom = prefix
	}
	return custom;
}

client.on('messageCreate', async message => {
	if (!message.guild) return
	const p = await client.prefix(message)
	const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setLabel('Invite Me')
			.setStyle('LINK')
			.setURL('https://discord.com/api/oauth2/authorize?client_id=870413726711435297&permissions=1103203134710&scope=bot%20applications.commands'),
			new MessageButton()
			.setLabel('Support Server')
			.setStyle('LINK')
			.setURL('https://discord.gg/j3YamACwPu'),
		);
	if (message.content.match(mentionRegex)) {
		const embed = new MessageEmbed()
			.setDescription(`**Hey ${message.author}, My Prefix Is \`${p}\` If You Need Any Help You Can Join The Support Server**`)
			.setColor("#6F8FAF")
		message.reply({
			embeds: [embed],
			components: [row]
		}).catch(err => {})
	}
	if (!message.content.startsWith(p)) return;
	if (message.author.bot) return;
	if (!message.member) message.member = await message.guild.fetchMember(message);
	const args = message.content.slice(p.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	if (cmd.length == 0) return;
	const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

	if (!command) return

	if (command?.owner === true && !owners_id.includes(message.author.id)) return

	if (command) {

		if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES", "ATTACH_FILES")) return;

		if (!message.member.permissions.has(command.userPerms || [])) {
			let noPerms = new MessageEmbed()
				.setDescription(`My Apologies But You Can Not Use This Command You Are Missing The ${command.userPerms} Permissions`)
				.setColor("#6F8FAF")
			return message.reply({
				embeds: [noPerms]
			})
		}

		if (!message.guild.me.permissions.has(command.botPerms || [])) {
			let noPerms = new MessageEmbed()
				.setDescription(`My Apologies But I Do Not Have The ${command.botPerms} Permissions`)
				.setColor("#6F8FAF")
			return message.reply({
				embeds: [noPerms]
			})
		}

		if (message.content.length > command.msgLimit) {
			let limit = new MessageEmbed()
				.setDescription(`My Apologies But Please Keep The Message Content Under ${command.msgLimit} Letters`)
				.setColor("#6F8FAF")
			return message.reply({
				embeds: [limit]
			})
		} else {

			if (command.timeout) {

				let cooldown;
				try {
					cooldown = await cooldownSchema.findOne({
						userID: message.author.id,
						commandName: command.name
					})
					if (!cooldown) {
						cooldown = await cooldownSchema.create({
							userID: message.author.id,
							commandName: command.name,
							cooldown: 0
						})
						cooldown.save()
					}
				} catch (e) {
					console.error(e)
				}

				if (!cooldown || command.timeout * 1000 - (Date.now() - cooldown.cooldown) > 0) {
					let timecommand = prettyMilliseconds(command.timeout * 1000, {
						verbose: true,
						verbose: true
					})

					const timeleft = prettyMilliseconds(command.timeout * 1000 - (Date.now() - cooldown.cooldown), {
						verbose: true
					})

					let cooldownMessage = command.cooldownMsg ? command.cooldownMsg.description : `My Apologies But You Can Only Use This Command Every **${timecommand}**!\n> Try Again In: **${timeleft}** `;

					let cooldownMsg = cooldownMessage.replace("[timeleft]", `${timeleft}`).replace("[cooldown]", `${timecommand}`).replace("[user]", `${message.author.username}`)

					let cooldownEmbed = new MessageEmbed()
						.setTitle(`${command.cooldownMsg ? command.cooldownMsg.title : "Slow Down!"}`)
						.setDescription(cooldownMsg)
						.setColor(`${command.cooldownMsg ? command.cooldownMsg.color : "#6F8FAF"}`)
					return message.reply({embeds: [cooldownEmbed]})
					//return message.react("⏳")
				} else {
					command.run(client, message, args)
					await cooldownSchema.findOneAndUpdate({
						userID: message.author.id,
						commandName: command.name
					}, {
						cooldown: Date.now()
					})
				}
			} else {
				command.run(client, message, args)
			}
		}
	}
});
