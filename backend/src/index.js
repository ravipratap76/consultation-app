const express=require("express");
require('./db/mongoose')
const { doctorRouter } = require("./routers/doctorRouter");
const { bookingRouter } = require("./routers/bookingRouter");
const { rateRouter } = require("./routers/rateRouter");
const { earningRouter } = require("./routers/earningRouter");

const app=express();
const port = process.env.PORT || 3000
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome to Home Route")
}) 

app.use("/doctor",doctorRouter)
app.use("/appointment",bookingRouter)
app.use("/expertise-rate",rateRouter)
app.use("/earning",earningRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

