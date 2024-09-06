const express=require("express");
require('./db/mongoose')
const { userRouter } = require("./routers/userRouter");
const { bookingRouter } = require("./routers/bookingRouter");
const { rateRouter } = require("./routers/rateRouter");

const app=express();
const port = process.env.PORT || 3000
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome to Home Route")
}) 

app.use("/user",userRouter)
app.use("/booking",bookingRouter)
app.use("/expertise-rate",rateRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

