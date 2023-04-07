import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder, Partials, Collection } from "discord.js"
import { log, loader, error as logError, warn, info, database, } from "./utils/logger.js"
import { chalkcolor, messagecolor } from './utils/color.js'
import commands from './utils/handlers/commands.js'
import config from './config.js'
import slashCommands from './utils/handlers/slashCommands.js'
import event from './utils/handlers/event.js'
import error from './utils/handlers/error.js'


const handlerObject = {
    "commands": commands,
    "error": error,
    "event": event,
    "slashCommands": slashCommands
} as const

interface ClientCommands {
    commands?: any
    slash?: any
    aliases?: any
    logger?: any
    color?: any
    config?: any
}
interface ExtendedClient extends Client<boolean>, ClientCommands { }

const client: ExtendedClient = new Client({
    intents: [IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions],
    partials: [
        Partials.Message,
        Partials.Reaction
    ]



})

//SET COLLECTION
client.commands = new Collection()
client.slash = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

//SET UTILS
client.logger = { log, loader, error: logError, warn, info, database }
client.color = { chalkcolor, messagecolor }

//SET CONFIG

client.config = config

// LOAD THE 4 HANDLERS
declare function require(name: string);
const handlers = ["error", "commands", "slashCommands", "event"]
handlers.forEach((file) => {
    handlerObject[file](client)
    // if (file === "slashCommands") {
    // }
})

client.login(client.config.token); 