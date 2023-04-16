import util from "util"
import { exec } from 'child_process'

export const promiseExec = util.promisify(exec)
export function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) return reject(error)
            if (stderr) return reject(stderr)
            resolve(stdout)
        })
    })
}