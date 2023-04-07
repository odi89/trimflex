import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async function (client) {
    fs.readdir(`${__dirname}/../../event/`, (err, files) => {
        // console.log(files)
        // Filter out sourcemaps
        files = files.filter((f) => !f.endsWith(".map"))
        // console.log(files)
        if (err) client.logger.error(err);
        files.forEach(file => {
            // file = file.filter((f) => !f.endsWith(".map"))
            import(`${__dirname}/../../event/${file}`).then(settings => {
                const event = settings.default
                let eventName = file.split(".")[0];
                client.on(eventName, event.bind(null, client));
            })
        });
        client.logger.loader(`${client.color.chalkcolor.red('[FINISH]')} ${files.length} events loaded`)
    });
}
