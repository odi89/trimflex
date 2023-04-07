import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder, Partials, Collection } from "discord.js"

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
client.logger = require('./src/utils/logger');
client.color = require('./src/utils/color.js');

//SET CONFIG
client.config = require('./config');

// LOAD THE 4 HANDLERS
["error", "command", "slashCommands", "event"].forEach(file => { require(`./src/utils/handlers/${file}`)(client) })

client.login(client.config.token); 