const { MessageEmbed, MessageAttachment } = require("discord.js");
const emojis = require("../emojis")
const client = require("../index");

client.on("ready", async () => {
let servers = client.guilds.cache.size
let servercount = client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)
console.log(`Ready! Logged in as ${client.user.tag}\ncurrently in ${servers} servers and watching over ${servercount} members`);  

let ready = new MessageEmbed()
.setDescription(`Bot Is Back Online ${emojis.emoji}`)
.setColor("#6F8FAF")
.setTimestamp()
client.channels.cache.get('Your logs channel id').send({embeds: [ready]})
console.log('Sent')

client.user.setActivity(`/help | ${servers} servers`, { type: 'PLAYING' });
});
