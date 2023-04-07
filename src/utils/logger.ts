import chalk from "chalk"
import dayjs from "dayjs";
import { LoggerError } from './CustomError.js'
const timestamp = `[${dayjs().format(" HH:mm:ss | DD-MM-YYYY")}]`;

export function log(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.blue.underline(('[LOG]'))} ${content}`)
}

export function loader(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.green.underline(('[LOADER]'))} ${content}`)
}

export function error(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.red.underline(('[ERROR]'))} ${content}`)
}

export function warn(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.yellow.underline(('[WARN]'))} ${content}`)
}

export function info(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.magenta.underline(('[INFO]'))} ${content}`)
}

export function database(content) {
    if (!content) throw new LoggerError('No text found');
    console.log(`${chalk.cyan(timestamp)} ${chalk.yellowBright.underline(('[DATABASE]'))} ${content}`)
}
