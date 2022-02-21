const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
 
module.exports = {
    name: "avatar",
    description: "Get somones avatar",
options: [
                {
                    name: "user",
                    description: "the person you want to view its avatar",
                    type: "USER",
                    required: false,
                },
            ],
   run: async (client, interaction, args) => {
const user = await interaction.options.getUser("user") || interaction.user;   
const embed = new MessageEmbed()
.setTitle(`${user.tag}'s  Avatar`)
.setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
.setColor("#6F8FAF")
.setTimestamp();
 
const linksRow = new MessageActionRow().addComponents(
 
  new MessageButton()
  .setLabel("JPG")
 .setStyle("LINK")
   .setURL(`${user.displayAvatarURL({format: "jpg",size: 1024,})}`),
   new MessageButton()
  .setLabel("PNG")
 .setStyle("LINK")
   .setURL(`${user.displayAvatarURL({format: "png",size: 1024,})}`),
    new MessageButton()
  .setLabel("GIF")
 .setStyle("LINK")
   .setURL(`${user.displayAvatarURL({format: "gif",size: 1024, dynamic: true,})}`),
   new MessageButton()
  .setLabel("WEBP")
 .setStyle("LINK")
   .setURL(`${user.displayAvatarURL({format: "webp",size: 1024,})}`),
 )
 
 interaction.editReply({embeds: [embed], components: [linksRow]});
}
} 
