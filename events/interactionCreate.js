const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.followUp({
        content: "An error has occured ",
      });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    if (!interaction.memberPermissions.has(cmd.userPerms || []))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My Apologies But You Do Not Have The Required Permissions To Use This Command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.userPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("#6F8FAF"),
        ],
        ephemeral: true,
      });

    if (!interaction.guild.me.permissions.has(cmd.botPerms || []))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My Apologies But I Do Not Have The Required Permissions To Run This Command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.botPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("#6F8FAF"),
        ],
        ephemeral: true,
      });

    cmd.run(client, interaction, args);
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});

function nicerPermissions(permissionString) {
  return permissionString
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}