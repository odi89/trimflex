import express from "express"
export const hi = "hey mom!"
const PORT = 5500
const app = express()


app.get("/", (req, res) => {
    console.log("you hit")
})

app.listen(PORT, () => {
    console.log(`server startet on port ${PORT}`)
}) 
