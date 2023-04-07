// This file allows you to register slash commands, it must be launched each time you add a new (/) command
import { fileURLToPath } from 'url';
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { readdirSync } from 'fs';
import path from "path"
import config from "./config.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = []
const fun = await Promise.all(readdirSync("./src/slashCommands/").map(async dir => {
    return await Promise.all(readdirSync(`./src/slashCommands/${dir}/`).map(async (cmd) => {
        return await import(path.join(__dirname, `./slashCommands/${dir}/${cmd}`).replace("ts", "js")).then(async (command) => {
            // console.log(command.default)
            commands.push(command.default)
            return command.default
        })

    }))
}))
console.log(commands)
// console.log(fun)
const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
    try {
        console.log('[Discord API] Started refreshing application (/) commands.');
        await rest.put(
            // GUILD SLASH COMMANDS (will deploy only in the server you put the ID of)
            // Routes.applicationGuildCommands(config.botID, 'ID_OF_THE_GUILD'),

            // GLOBAL SLASH COMMANDS
            Routes.applicationCommands(config.botID),
            { body: commands },
        );
        console.log('[Discord API] Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();