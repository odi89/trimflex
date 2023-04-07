import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (client) {
    fs.readdir(`${__dirname}/../../slashCommands/`, (err, files) => {
        console.log(files)
        if (err) client.logger.error(err);
        files.forEach(dir => {
            fs.readdir(`${__dirname}/../../slashCommands/${dir}/`, (err, file) => {
                if (err) client.logger.error(err);
                file = file.filter((f) => !f.endsWith(".map"))
                file.forEach(f => {
                    import(`${__dirname}/../../slashCommands/${dir}/${f}`).then(settings => {
                        const props = settings.default
                        client.slash.set(props.name, props);
                    });

                    client.logger.loader(`${client.color.chalkcolor.red(`${dir}`)} loaded with ${file.length} (/) commands`)
                });
            });
        })
    })
}