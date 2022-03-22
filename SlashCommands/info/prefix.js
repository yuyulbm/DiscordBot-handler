const prefixSchema = require('../../models/prefix');
let { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Permissions, CommandInteraction } = require("discord.js")

module.exports = {
name: "prefix",
description: "Change Prefix",
options: [
{
name: 'prefix',
type: 'STRING',
description: 'prefix to change to',
required: true
},
],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
run: async (client, interaction, args) => {

if (SUB_COMMAND === "prefix") {
const prefix = interaction.options.getString("prefix");
if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))return interaction.reply({ embeds: [errEmbed.setDescription(`**You Do Not Have MANAGE_SERVER Permissions**`)] })

prefixSchema.findOne({ Guild : interaction.guild.id }, async(err, data) => {
if(err) throw err;
          
if(data) {
data.delete()
return interaction.reply(`The Prefix Has Been Reset To $`) 
} 

if(!data){
if(prefix.length > 3)return interaction.reply(`Prefix Cant Be Longer Than 3 Characters`)
data = new prefixSchema({
Guild : interaction.guild.id,
Prefix : prefix
})
data.save()
interaction.reply(`Custom Prefix In This Server Is Now Set To **${prefix}**`)
}
})
}
},
};
