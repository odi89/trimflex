import { EmbedBuilder } from 'discord.js';
import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import axios from "axios"

const config = {
    headers: { Authorization: `Bearer ${process.env.STRAVA_ACCESS_TOKEN}` }
};

export type RunType = {
    resource_state: number,
    athlete: any,
    name: string,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    total_elevation_gain: number,
    type: string,
    sport_type: string,
    workout_type: any
}

export const getStatisticsFromStrava = async () => {
    const { data } = await axios.get(`${process.env.STRAVA_API_URL}/clubs/${process.env.STRAVA_CLUB_ID}/activities?access_token=${process.env.STRAVA_ACCESS_TOKEN}`)
    const statistics = data.reduce((acc, run: RunType) => {
        acc.totalDistance += Math.round(run.distance / 1000)
        acc.totalElevationGain += run.total_elevation_gain
        acc.totalMovingTime += run.moving_time
        return acc
    }, { totalDistance: 0, totalElevationGain: 0, totalMovingTime: 0, totalActivitiesRecorded: data.length })
    return statistics
}
export const getLeaderBoardStatistics = async () => {
    const { data } = await axios.get(`${process.env.STRAVA_API_URL}/clubs/${process.env.STRAVA_CLUB_ID}/activities?access_token=${process.env.STRAVA_ACCESS_TOKEN}`)
    const stats = transformStatisticNaive(data)
    return stats

}
const groupData = (arr) => {
    const result = arr.reduce((acc, val) => {
        const existing = acc.find((obj) => obj["firstname"] == val.firstname)
        if (existing) {
            existing.data.push(val)
        }
        else {
            acc.push({ firstname: val.firstname, data: [val] })
        }
        return acc
    }, [])

    return result;
}
// getStatisticsFromStrava()
// getLeaderBoardStatistics()
export const transformStatisticNaive = (data) => {

    const mappedData = data.map((runner) => {
        const { athlete: { firstname, lastname } } = runner
        const data = {
            name: `${firstname} ${lastname}`,
            run: [runner]
        }
        return data
    })
    const mergedData = mappedData.reduce((acc, cur) => {
        const name = cur.name
        const existing = acc.find(a => a.name === name);
        if (existing) {
            existing["run"].push(cur)
        } else {
            acc.push(cur)
        }
        return acc
    }, [])

    const totalData = mergedData.map((runner) => {
        const totalSum = runner.run.reduce((acc, cur) => {
            acc.totalDistance += Math.round(cur.distance / 1000)
            acc.totalElevationGain += cur.total_elevation_gain
            acc.totalMovingTime += cur.moving_time
            return acc
        }, { totalDistance: 0, totalElevationGain: 0, totalMovingTime: 0, totalActivitiesRecorded: runner.run.length })
        const theRunner = {
            name: runner.name,
            data: totalSum
        }
        return theRunner
    })
    const totalActivites = totalData.sort((a, b) => {
        if (a.data.totalActivitiesRecorded > b.data.totalActivitiesRecorded) {
            return -1
        } else {
            return 1
        }
    })
    const totalMoving = totalData.sort((a, b) => {
        if (a?.data?.totalMovingTime > b?.data?.totalMovingTime) {
            return -1
        } else if (a?.data?.totalMovingTime < b?.data?.totalMovingTime) {
            return 1
        }
        else {
            return 1
        }
    }).filter((run) => run.data.totalMovingTime)
    return {
        totalActivites,
        totalMoving
    }
}
export const fetchLeaderboardImage = async (path: string) => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto("https://www.strava.com/clubs/991850");
        const cookieBtn = (await page.$eval(".btn-accept-cookie-banner", (btn: any) => btn.click()))
        const leaderboard = await page.$("body > div.view > div.page.container > div:nth-child(4) > div.spans11 > div > div:nth-child(2) > div.leaderboard")
        await leaderboard.screenshot({ path: `./dist/public/tavle.png` });
    } catch (e) {
        console.log(e)
    } finally {
        await browser.close();
    }
}
export const leaderBoardEmbed = ({ titleText, pathToImage }) => {
    // const leaderboardEmbed = new EmbedBuilder()
    //     .setColor(0x0099FF)
    //     .setTitle(titleText)
    //     .setURL('https://www.strava.com/clubs/991850')
    //     .setDescription('Leaderboard')
    //     .setThumbnail(pathToImage)
    //     .setImage(pathToImage)
    //     .setTimestamp()
    //     .setFooter({ text: 'Made with ❤️', iconURL: 'https://static.wixstatic.com/media/c702b4_27e519f6628e4f1db4a43175997fedce~mv2.png/v1/fill/w_177,h_82,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/1080x500_primary-logo-transparent-black_trimflex.png' });

    const exampleEmbed = new EmbedBuilder().setImage(pathToImage)
    // .setColor(0x0099FF)
    // .setTitle(titleText)
    // .setURL(pathToImage)
    // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    // .setDescription('Some description here')
    // .setThumbnail(pathToImage)
    // .addFields(
    //     { name: 'Regular field title', value: 'Some value here' },
    //     { name: '\u200B', value: '\u200B' },
    //     { name: 'Inline field title', value: 'Some value here', inline: true },
    //     { name: 'Inline field title', value: 'Some value here', inline: true },
    // )
    // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    // .setImage(pathToImage)
    // .setTimestamp()
    // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    return exampleEmbed
}
export const imageEmbed = ({ pathToImage }) => {
}