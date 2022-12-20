const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const { ButtonPaginationBuilder } = require("spud.js");
const moment = require("moment");
const prefix = require("../../models/prefix");

module.exports = {
  name: "help",
  description: "Get some help",
  options: [
    {
      name: "command",
      description: "get info on a command",
      type: "STRING",
      required: false,
    },
  ],
  run: async (client, interaction, args) => {
    let comman = interaction.options.getString("command");
    let custom;
    const data2 = await prefix
      .findOne({
        Guild: interaction.guildId,
      })
      .catch((err) => console.log(err));
    if (data2) {
      custom = data2.Prefix;
    }
    if (!data2) {
      const prefix = "$";
      custom = prefix;
    }

    if (!comman) {
      let embed = new MessageEmbed()
        .setTitle(`**${client.emo.smug} | Need Help?**`)
        .setDescription(
          `> **Prefix: **\`${custom}\`\n> **Total Commands: **\`${
            client.slashCommands.size + client.commands.size
          }\`\n> **[Invite Me](https://discord.com/oauth2/authorize?client_id=870413726711435297&permissions=1103203134710&scope=bot%20applications.commands)**\n> **[Support Server](https://discord.gg/PS38kJh9VC)**\n> **[Vote](https://top.gg/bot/870413726711435297/vote)**\n> **[Website](https://shinpitekita.repl.co/home)**`
        )
        .setColor("#6F8FAF")
        .setTimestamp();

      let embeds = [];

      embeds.push(embed);

      //Slash Commands
      let slashCommands = client.slashCommands;
      let helpCommand = slashCommands.filter((v) => v.name === "help");
      const subCommands = [];
      readdirSync("./SlashCommands/").forEach(async (dir) => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );
        const cmds = commands.map((command) => {
          let file = require(`../../SlashCommands/${dir}/${command}`);
          if (!file.name) return "No command name.";
          let name = file.name.replace(".js", "");
          let commandID = slashCommands.filter((v) => v.name === name);
          return `</${name}:${commandID.first().id}>`;
        });

        let data = new Object();
        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In progress." : cmds.join(", "),
        };
        embeds.push(
          new MessageEmbed()
            .setTitle(`**${data.name}**`)
            .setDescription(
              `**For more information on a command do </${
                helpCommand.first().name
              }:${helpCommand.first().id}> <command>\`\n\n${data.value}**`
            )
            .setColor("#6F8FAF")
            .setTimestamp()
        );
      });

      let sc = await client.commands
        .filter((c) => c?.owner !== true && c?.staff !== true)
        .map((c) => {
          return `\`${c.name} - ${c.description}\`` || "No Name";
        });

      embeds.push(
        new MessageEmbed()
          .setTitle(`**Message Commands**`)
          .setDescription(
            `**To use these commands do \`${custom}help <command>\`\n\n${sc.join(
              ",\n"
            )}**`
          )
          .setColor("#6F8FAF")
          .setTimestamp()
      );

      embeds.push(
        new MessageEmbed()
          .setTitle(`**Credits**`)
          .setDescription(
            `Owner: <@748597084134834186>\n\nI was created on ${moment
              .utc(client.user.createdAt)
              .format("dddd, MMMM Do YYYY")}`
          )
          .setColor("#6F8FAF")
          .setTimestamp()
      );

      const pagination = new ButtonPaginationBuilder(interaction)
        .setEmbeds(embeds)
        .setTime(60000)
        .replyOption(
          {
            interaction: true,
          },
          true
        )
        .setFilter(interaction.user.id, {
          content: "This interaction isn't for you.",
          ephemeral: true,
        })
        .fastSkip(true);

      pagination.send();
    } else {
      const command =
        client.commands
          .filter((c) => c?.owner !== true)
          .get(comman.toLowerCase()) ||
        client.commands
          .filter((c) => c?.owner !== true)
          .find((c) => c.aliases && c.aliases.includes(comman.toLowerCase())) ||
        client.slashCommands.get(comman.toLowerCase());

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`Invalid Command! Use </help:0> for all of my commands!`)
          .setColor("#6F8FAF");
        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addFields(
          {
            name: "PREFIX:",
            value: `\`${command?.type === "msg" ? `${custom}` : "/"}\``,
          },
          {
            name: "COMMAND:",
            value: command.name ? `\`${command.name}\`` : "No Name.",
          },
          {
            name: "ALIASES:",
            value: command.aliases
              ? `\`${command.aliases.join("` `")}\``
              : "No Aliases.",
          },
          {
            name: "USAGE:",
            value: command.usage
              ? `\`${command?.type === "msg" ? `${custom}` : "/"}${
                  command.name
                } ${command.usage}\``
              : `\`${command?.type === "msg" ? `${custom}` : "/"}${
                  command.name
                }\``,
          },
          {
            name: "DESCRIPTION:",
            value: command.description
              ? command.description
              : "No Description.",
          }
        )
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setTimestamp()
        .setColor("#6F8FAF");
      return interaction.reply({
        embeds: [embed],
      });
    }
  },
};
