const { EmbedBuilder, Events } = require("discord.js");
const client = require("../index");

client.on(Events.ClientReady, async () => {
  let servers = client.guilds.cache.size;
  let servercount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
  console.log(
    `Ready! Logged in as ${client.user.tag}\ncurrently in ${servers} servers and watching over ${servercount} members`
  );
  console.log(`Ping: ${client.ws.ping}`);

  let ready = new EmbedBuilder()
    .setTitle(`**${client.user.tag} is back online ${client.emo.happy}**`)
    .setDescription(`Ping: ${client.ws.ping}`)
    .setColor("GREEN")
    .setTimestamp();
  client.channels.cache.get("Your logs channel ID").send({
    embeds: [ready],
  });
  client.user.setPresence({
    activities: [
      {
        name: `/help | ${servers} servers`,
        type: 3,
      },
    ],
    status: "idle",
  });
});
