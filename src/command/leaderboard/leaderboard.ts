import { fileURLToPath } from 'url';
import { EmbedBuilder } from "discord.js"
import { getStatisticsFromStrava, getLeaderBoardStatistics, leaderBoardEmbed, fetchLeaderboardImage } from "../../utils/strava.js"
import path from "path"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default ({
    name: 'leaderboard',
    description: 'Viser stravaoversikt av ledertavle',
    usage: '<prefix>example [ping]', //OPTIONAL (for the help cmd)
    examples: ['example', 'example ping'], //OPTIONAL (for the help cmd)
    aliases: ['eg'],
    dir: "leaderboard",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: [], // OPTIONAL
    run: async (client, message, args) => {

        if (args[0] === 'stats') {
            const data = await getStatisticsFromStrava()
            const {

                totalActivites,
                totalMoving
            } = await getLeaderBoardStatistics()
            let msgString = totalMoving.map(({ name, data: { totalDistance, totalMovingTime, totalActivitiesRecorded } }, idx) => {
                return `
                 #${idx + 1} ${name}  
                    Total Distanse: ${totalDistance}  
                    Total Moving Time: ${totalMovingTime}  
                `
            }).join("")
            message.reply(`
            Denne statistikken skal bli bedre!😁 \n
            ${msgString}
            `)
        } else if (args[0] === "pic") {
            const imagePath = path.resolve("/dist", "public")
            message.reply("To sek jeg fikser...")
            await fetchLeaderboardImage(imagePath)
            // const image = 
            const leaderboardEmbed = leaderBoardEmbed({ titleText: "Trimflex leaderboard", pathToImage: "./dist/images/tavle.png" })
            message.reply({ embeds: [leaderboardEmbed] });

            // message.send({ embeds: [exampleEmbed] });
        }
        else {
            message.reply("Hello world !")
        }
    }
})
