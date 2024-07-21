const express = require("express")


const dotenv = require("dotenv").config()

const connectDatabase = require("./config/dbase")
const User = require("./routes/userRoute")

const app =express()


app.use(express.json())

// app.use(cors())


const PORT = process.env.PORT || 6000

// Invoking DB function
connectDatabase()

app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`)
})

app.get("/", (req, res)=>{
  res.status(200).json({message: "Welcome to Shopezzy Server"})
})

app.use(User)

// app.use("/api", routeres)

// app.use("/api", routee)

// app.use('/api', auth)





app.use((req, res)=>{
  res.status(404).json({message:"Sorry, this path doesn't exist!"})
})