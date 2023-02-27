const client = require("../index");
const {
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const cooldownSchema = require("../models/cooldown");
const prettyMilliseconds = require("pretty-ms");
const owners_id = client.config.owner;
const prefix = require("../models/prefix");

client.prefix = async function (message) {
  let custom;
  const data = await prefix
    .findOne({
      Guild: message.guildId,
    })
    .catch((err) => console.log(err));
  if (data) {
    custom = data.Prefix;
  }
  if (!data) {
    const prefix = client.config.prefix;
    custom = prefix;
  }
  return custom;
};

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  const p = await client.prefix(message);
  const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Invite Me")
      .setStyle("LINK")
      .setURL(client.config.invite),
    new MessageButton()
      .setLabel("Support Server")
      .setStyle("LINK")
      .setURL(client.config.server)
  );
  if (message.content.match(mentionRegex)) {
    const embed = new MessageEmbed()
      .setDescription(
        `**Hey ${message.author.username}, My prefix is \`${p}\` If you need any help you can join the support server.**`
      )
      .setColor("GREEN");
    message
      .reply({
        embeds: [embed],
        components: [row],
      })
      .catch((err) => {});
  }
  if (!message.content.startsWith(p)) return;
  if (message.author.bot) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(p.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  if (command?.owner === true && !owners_id.includes(message.author.id)) return;

  if (command) {
    if (
      !message.guild.me
        .permissionsIn(message.channel)
        .has("SEND_MESSAGES", "EMBED_LINKS")
    )
      return;

    if (!message.member.permissions.has(command.userPerms || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My apologies but you do not have the required permissions to run this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.userPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    }

    if (!message.guild.members.me.permissions.has(command.botPerms || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My apologies but I do not have the required permissions to run this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.botPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    }

    if (message.content.length > command.msgLimit) {
      let limit = new MessageEmbed()
        .setDescription(
          `My apologies please keep the message content under ${command.msgLimit} characters.`
        )
        .setColor("RED");
      return message.reply({
        embeds: [limit],
      });
    } else {
      if (command.timeout) {
        let cooldown;
        try {
          cooldown = await cooldownSchema.findOne({
            userID: message.author.id,
            commandName: command.name,
          });
          if (!cooldown) {
            cooldown = await cooldownSchema.create({
              userID: message.author.id,
              commandName: command.name,
              cooldown: 0,
            });
            cooldown.save();
          }
        } catch (e) {
          console.error(e);
        }

        if (
          !cooldown ||
          command.timeout * 1000 - (Date.now() - cooldown.cooldown) > 0
        ) {
          let timecommand = prettyMilliseconds(command.timeout * 1000, {
            verbose: true,
            verbose: true,
          });

          const timeleft = prettyMilliseconds(
            command.timeout * 1000 - (Date.now() - cooldown.cooldown),
            {
              verbose: true,
            }
          );

          let cooldownMessage = command.cooldownMsg
            ? command.cooldownMsg.description
            : `My Apologies But You Can Only Use This Command Every **${timecommand}**!\n> Try Again In: **${timeleft}** `;

          let cooldownMsg = cooldownMessage
            .replace("[timeleft]", `${timeleft}`)
            .replace("[cooldown]", `${timecommand}`)
            .replace("[user]", `${message.author.username}`);

          let cooldownEmbed = new MessageEmbed()
            .setTitle(
              `${
                command.cooldownMsg ? command.cooldownMsg.title : "Slow Down!"
              }`
            )
            .setDescription(cooldownMsg)
            .setColor(
              `${command.cooldownMsg ? command.cooldownMsg.color : "RED"}`
            );
          //return message.reply({embeds: [cooldownEmbed]})
          return message.react("⏳");
        } else {
          command.run(client, message, args);
          await cooldownSchema.findOneAndUpdate(
            {
              userID: message.author.id,
              commandName: command.name,
            },
            {
              cooldown: Date.now(),
            }
          );
        }
      } else {
        command.run(client, message, args);
      }
    }
  }
});

function nicerPermissions(permissionString) {
  return permissionString
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
