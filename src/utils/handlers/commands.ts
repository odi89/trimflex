import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async (client) => {
    fs.readdir(`${__dirname}/../../command/`, (err, files) => {
        if (err) client.logger.error(err);
        files.forEach(dir => {
            fs.readdir(`${__dirname}/../../command/${dir}/`, (err, file) => {
                if (err) client.logger.error(err);
                // Filter out sourcemaps
                file = file.filter((f) => !f.endsWith(".map"))
                file.forEach(f => {
                    import(`${__dirname}/../../command/${dir}/${f}`).then(settings => {
                        const props = settings.default
                        client.commands.set(props.name, props);
                        props.aliases.forEach(alias => {
                            client.aliases.set(alias, props.name);
                        });
                    });
                });

                client.logger.loader(`${client.color.chalkcolor.magenta(`${dir}`)} loaded with ${file.length} commands`)
            });
        });
    })
}