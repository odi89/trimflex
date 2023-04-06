import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { REST, Routes, ApplicationCommandOptionType } from "discord.js"

const commands = [
    { name: "embed", description: "Sends and embed" },
    { name: "lfg", description: "Lets fucking go" },
    {
        name: "add",
        description: "Adds two numbers",
        options: [
            {
                name: "first-number",
                description: "The first number",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    { name: "one", value: 1 },
                    { name: "two", value: 2 },
                    { name: "three", value: 3 },
                ],
                required: true
            }, {
                name: "second-number",
                description: "The second number",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    { name: "one", value: 1 },
                    { name: "two", value: 2 },
                    { name: "three", value: 3 },
                ],
                required: true
            }

        ]
    }]

const token = process.env.TOKEN
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);


async function main() {

    try {
        console.log("Starting slash commands")
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log("slash comamnds uses")
    } catch (err) {
        console.log(err)
    }
}

main()