import express, { Request, Response } from "express"
import { fileURLToPath } from 'url';
import path from "path"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.PORT || 5432

app.use('/api/', express.static(path.resolve(__dirname, '../public')))

app.get("/", (req: Request, res: Response) => {
    res.send("Hello")
})


app.listen(PORT, () => {
    console.log("Server starte on port:", PORT)
})