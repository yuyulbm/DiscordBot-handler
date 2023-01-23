const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

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
    const user =
      (await interaction.options.getUser("user")) || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s  Avatar`)
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024,
        })
      )
      .setColor("#6F8FAF")
      .setTimestamp();

    const linksRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("JPG")
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.displayAvatarURL({ format: "jpg", size: 1024 })}`),
      new ButtonBuilder()
        .setLabel("PNG")
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.displayAvatarURL({ format: "png", size: 1024 })}`),
      new ButtonBuilder()
        .setLabel("GIF")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `${user.displayAvatarURL({
            format: "gif",
            size: 1024,
            dynamic: true,
          })}`
        ),
      new ButtonBuilder()
        .setLabel("WEBP")
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.displayAvatarURL({ format: "webp", size: 1024 })}`)
    );

    interaction.reply({
      embeds: [embed],
      components: [linksRow],
    });
  },
};
