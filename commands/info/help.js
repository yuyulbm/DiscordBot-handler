const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { ButtonPaginationBuilder } = require("spud.js");
const prefix = require("../../models/prefix");
module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Get some help",
  usage: "<command name>",
  run: async (client, message, args) => {
    let custom;
    const data2 = await prefix
      .findOne({
        Guild: message.guildId,
      })
      .catch((err) => { });
    if (data2) {
      custom = data2.Prefix;
    }
    if (!data2) {
      const prefix = "$";
      custom = prefix;
    }

    if (!args[0]) {
      let embed = new MessageEmbed()
        .setTitle(`**${client.emo.smug} | Need Help?**`)
        .setDescription(
          `> **Prefix: **\`${custom}\`\n> **Total Commands: **\`${client.slashCommands.size + client.commands.size
          }\`\n> **[Invite Me](https://discord.com/oauth2/authorize?client_id=870413726711435297&permissions=1103203134710&scope=bot%20applications.commands)**\n> **[Support Server](https://discord.gg/PS38kJh9VC)**\n> **[Vote](https://top.gg/bot/870413726711435297/vote)**\n> **[Website](https://shinpitekita.repl.co/home)**`
        )
        .setColor("#1F51FF")
        .setTimestamp();

      let embeds = [];

      embeds.push(embed);

      //Slash Commands
      let slashCommands = client.slashCommands;
      let helpCommand = slashCommands.filter((v) => v.name === "help");
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
              `**For more information on a command do </${helpCommand.first().name
              }:${helpCommand.first().id}> <command>\`\n\n${data.value}**`
            )
            .setColor("#1F51FF")
            .setTimestamp()
        );
      });

      let sc = await client.commands
        .filter(c => c?.owner !== true && c?.staff !== true)
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
          .setColor("#1F51FF")
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
          .setColor("#1F51FF")
          .setTimestamp()
      );

      const pagination = new ButtonPaginationBuilder(message)
        .setEmbeds(embeds)
        .setTime(60000)
        .setFilter(message.author.id, {
          content: "This interaction isn't for you.",
          ephemeral: true,
        })
        .trash(true)
        .fastSkip(true);

      pagination.send();
    } else {
      const command =
        client.commands
          .filter((c) => c?.owner !== true)
          .get(args[0].toLowerCase()) ||
        client.commands
          .filter((c) => c?.owner !== true)
          .find(
            (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
          ) ||
        client.slashCommands.get(args[0].toLowerCase());

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`Invalid Command! Use </help:0> for all of my commands!`)
          .setColor("#1F51FF");
        return message.reply({
          embeds: [embed],
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
              ? `\`${command?.type === "msg" ? `${custom}` : "/"}${command.name
              } ${command.usage}\``
              : `\`${command?.type === "msg" ? `${custom}` : "/"}${command.name
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
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({
            dynamic: true,
          }),
        })
        .setTimestamp()
        .setColor("#1F51FF");
      return message.reply({
        embeds: [embed],
      });
    }
  },
};
