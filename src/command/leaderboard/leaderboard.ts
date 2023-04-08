import { getStatisticsFromStrava, getLeaderBoardStatistics } from "../../utils/strava.js"
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
        } else {
            message.reply("Hello world !")
        }
    }
})
