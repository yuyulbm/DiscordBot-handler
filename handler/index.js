const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Command handler
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);// looks for the folder named commands
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }//allows command
    });

    // Event handler
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);//looks for folder named events
    eventFiles.map((value) => require(value));

    // Slash Commands handler
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
         await client.application.commands.set(arrayOfSlashCommands);
    });

 await mongoose.connect("You Mongo String").then(() => console.log('Connected to mongodb'));
};
