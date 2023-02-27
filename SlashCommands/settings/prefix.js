const prefixSchema = require("../../models/prefix");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "prefix",
  description: "Configure server prefix.",
  userPerms: ["ADMINISTRATOR"],
  botPerms: ["EMBED_LINKS", "SEND_MESSAGES"],
  options: [
    {
      name: "prefix",
      type: "STRING",
      description: "Custom prefix.",
      required: true,
      minLength: 1,
      maxLength: 3,
    },
  ],
  run: async (client, interaction, args) => {
    const prefix = interaction.options.getString("prefix");
    let errEmbed = new MessageEmbed().setColor("RED");

    prefixSchema.findOne(
      {
        Guild: interaction.guild.id,
      },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          data.delete();
          return interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `**Server prefix has been reset to \`\`\`${client.config.prefix}\`\`\`**`
              ),
            ],
          });
        }
        if (!data) {
          data = new prefixSchema({
            Guild: interaction.guild.id,
            Prefix: prefix,
          });
          data.save();
          interaction.reply({
            embeds: [
              errEmbed.setDescription(
                `Custom prefix in this server is now set to \`\`\`${prefix}\`\`\``
              ),
            ],
          });
        }
      }
    );
  },
};
