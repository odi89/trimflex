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

