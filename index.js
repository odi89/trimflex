import express from "express"
const PORT = 5500
const app = express()


app.get("/",(req,res)=>{
    console.log("you hit")
})

app.listen(PORT, ()=>{
    console.log(`server startet on port ${PORT}`)
})