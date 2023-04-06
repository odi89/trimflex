import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder } from "discord.js"

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],


})

client.on("ready", (c) => {
    console.log(`${c.user.tag} is online🚀`)
    console.log("the bot is ready")
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

})


client.on("interactionCreate", async (interaction) => {
    // One interaction
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "embed") {
        console.log("embed hit")

        const embed = new EmbedBuilder().setTitle("Embed title").setDescription("This is an description").setColor("Random").addFields({ name: "Field title", value: "Some random title", inline: true }, { name: "Second Field title", value: "Some other title", inline: true })
        interaction.reply({ embeds: [embed] })
    }


    if (interaction.commandName === "add") {
        const num1: any = interaction.options.get("first-number")?.value
        const num2: any = interaction.options.get("second-number")?.value
        interaction.reply(`The sum is ${num1 + num2}`)
    }

    if (interaction.commandName === "lfg") {
        console.log("lets go")
        const listedUsers = [];
        const usersInRoot = await fetchChannels(interaction)
        console.log(usersInRoot)
        const userNames = usersInRoot.map(({ username }) => {
            return `${username} `
        }).join(",")

        const message = usersInRoot.length > 1 ? `Det er flere folk som vil spille ${userNames} er på og klar for å skyte HS🔫` : `${userNames} er alene og vil skyte HS`
        interaction.reply(message)
    }




})

const fetchChannels = async (message) => {
    let channelNames = []
    const channels = await message.guild.channels.fetch()
    const members = await message.guild.members.fetch();
    const activeChannels = channels.map((channel) => {
        return channel
    })
    const root = channels.find((chan) => chan.id === "1051586125766074378")
    const usersInRoot = root.members.map((member) => member.user)


    return usersInRoot
}

client.on("messageCreate", async (message) => {
    if (message.content === "embed") {

        const embed = new EmbedBuilder().setTitle("Embed title").setDescription("This is an description").setColor("Random").addFields({ name: "Field title", value: "Some random title", inline: true }, { name: "Second Field title", value: "Some other title", inline: true })
        message.channel.send({ embeds: [embed] })


    }

    if (message.content === "lfg") {
        const listedUsers = [];
        const channels = await fetchChannels(message)
    }


}
)

client.login(process.env.TOKEN)