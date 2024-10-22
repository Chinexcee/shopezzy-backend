const express = require("express")


const dotenv = require("dotenv").config()
const connectDatabase = require("./config/dbase")


const userRoutes = require("./routes/userRoute"); 
const businessRoutes = require("./routes/businessRoute"); 
const adRoutes = require("./routes/adRoute"); 
const cartRoutes = require("./routes/cartRoute"); 
const orderRoutes = require("./routes/orderRoute"); 


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

app.use("/api/User", userRoutes)
app.use("/api/Business", businessRoutes)
app.use("/api/Ad", adRoutes)
app.use("/api/Cart", cartRoutes)
app.use("/api/Order", orderRoutes)





app.use((req, res)=>{
  res.status(404).json({message:"Sorry, this path doesn't exist!"})
})