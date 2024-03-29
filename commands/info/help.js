const { MessageEmbed } = require("discord.js");
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
      .catch((err) => {});
    if (data2) {
      custom = data2.Prefix;
    }
    if (!data2) {
      const prefix = client.config.prefix;
      custom = prefix;
    }

    if (!args[0]) {
      let embed = new MessageEmbed()
        .setTitle(`**${client.emo.happy} | Need Help?**`)
        .setDescription(
          `> **Prefix: **\`${custom}\`\n> **Total Commands: **\`${
            client.slashCommands.size + client.commands.size
          }\`\n> **[Invite Me](${
            client.config.invite
          })**\n> **[Support Server](${client.config.server})**`
        )
        .setColor("#1F51FF")
        .setTimestamp();

      let embeds = [];

      embeds.push(embed);

      //Slash Commands
      const directories = [
        ...new Set(client.slashCommands.map((cmd) => cmd.directory)),
      ];
      const helpCommand = client.slashCommands.filter((v) => v.name === "help");
      directories.map((dir) => {
        const getCommands = client.slashCommands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return `</${cmd.name}:${cmd.id}>`;
          });

        let data = new Object();
        data = {
          name: dir.toUpperCase(),
          value:
            getCommands.length === 0 ? "In progress." : getCommands.join(", "),
        };
        embeds.push(
          new MessageEmbed()
            .setTitle(`**${data.name}**`)
            .setDescription(
              `**For more information on a command do </${
                helpCommand.first().name
              }:${helpCommand.first().id}> <command>\`\n\n${data.value}**`
            )
            .setColor("#1F51FF")
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
