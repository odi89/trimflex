import prefix from "../config.js"

export default async (client) => {
    client.logger.info(`[!] ${client.user.username} is now started...`)
    client.logger.info(`[!] The bot have ${client.commands.size} commands and ${client.slash.size} (/) commands`)
    client.user.setActivity(`${prefix}help | github.com/antoinemcx`, { type: 'PLAYING' })
};