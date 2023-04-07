import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
export default ({
    token: process.env.TOKEN,
    botID: process.env.CLIENT_ID,
    prefix: process.env.PREFIX,
    owner: [process.env.GUILD_ID],
})