const {
	MessageEmbed
} = require('discord.js')

const moment = require("moment");
require("moment-duration-format");

const Discord = require('discord.js')
module.exports = {
	name: 'ping',
	category: "info",
	description: 'display bots latency',
	usage: '',
	run: async (client, message, args) => {

		let embed1 = new MessageEmbed()
			.setDescription("🏓 | Ping ...")
			.setColor("#6F8FAF")

		let msg = await message.reply({
			embeds: [embed1]
		})

		let ping = msg.createdTimestamp - message.createdTimestamp

		const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

		let zap = "⚡"

		let snail = "🐌"

		let green = "🟢"

		let red = "🔴"

		let yellow = "🟡"

		var color = zap;
		var color2 = zap;

		let cPing = Math.round(client.ws.ping)

		if (cPing >= 40) {
			color2 = green;
		}

		if (cPing >= 200) {
			color2 = yellow;
		}

		if (cPing >= 400) {
			color2 = red;
		}

		if (cPing >= 1000) {
			color2 = snail;
		}

		if (ping >= 40) {
			color = green;
		}

		if (ping >= 200) {
			color = yellow;
		}

		if (ping >= 400) {
			color = red;
		}

		if (ping >= 1000) {
			color = snail;
		}

		let info = new MessageEmbed()
			.setTitle("🏓 | Pong!")
			.addField("API Latency", `${color2} | ${cPing}ms`, true)
			.addField("Message Latency", `${color} | ${ping}ms`, true)
			.addField("Uptime", `⏲️ | ${duration}`, true)
			.setColor("#6F8FAF")
			.setFooter(`Requested by ${message.author.username}`,
				message.author.displayAvatarURL()
			);
		msg.edit({
			embeds: [info]
		})

	}
}
