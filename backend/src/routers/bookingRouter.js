const express = require("express");
const { Bookingmodel } = require("../models/bookingModel");
const { Usermodel } =require("../models/userModel");
const bookingRouter = express.Router();


//1.Book/Schedule Appointment 
bookingRouter.post("/create" , async (req, res) => {
    const bookingData = req.body;
    try {
        let allBookings = await Bookingmodel.find({ doctorId: bookingData.doctorId })
        console.log(allBookings)
        if (allBookings.length === 0) {
            const addData = new Bookingmodel(bookingData);
            await addData.save();
            res.json({" msg": "New Appointment created", "Data": bookingData })
        } else {
            for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i].bookingDate === bookingData.bookingDate&&allBookings[i].bookingSlot === bookingData.bookingSlot) {
                        res.json({ "msg": "This Slot is Not Available." })
                        return;
                }
            }
            const addData = new Bookingmodel(bookingData);
            await addData.save();
            res.json({" msg": "New Appointment created", "Data": bookingData })

        }

    } catch (error) {
        console.log("error from adding new booking data", error.message);
        res.json({ msg: "error in adding new booking data", "errorMsg": error.message })
    }
})

//2.Reschedule Appointment 
bookingRouter.patch('/reschedule/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['bookingDate', 'bookingSlot', 'doctorId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        //check doctor availablity
        const ID = req.params.id
        console.log(req.params.id)
        let bookingData = await Bookingmodel.find({_id:ID})
        console.log(bookingData)
        let doctorId=bookingData[0].doctorId
        let allBookings = await Bookingmodel.find({ doctorId: doctorId })
        //console.log(allBookings)
        for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i].bookingDate === bookingData[0].bookingDate&&allBookings[i].bookingSlot === bookingData[0].bookingSlot){
                    //console.log(doctorId)
                    let doctor=await Usermodel.find({ _id: doctorId })
                    let expertise=doctor[0].expertise
                    console.log(expertise)
                    let allDoctor=await Usermodel.find({expertise})
                    res.json({ "msg": `This Slot is Not Available.Other ${expertise} available`, "data" : allDoctor})
                    return;
                }}
        const rescheduleBooking = await Bookingmodel.findByIdAndUpdate(ID, req.body, { new: true, runValidators: true })
        res.json({"msg":"Appointment Rescheduled ","data":rescheduleBooking})
    } catch (error) {
        console.log("error from getting all booking route",error);
        res.json({"msg":"error while appointment reschedule"})
    }
})

//3.CancelAppointment
bookingRouter.delete("/cancel/:id",async (req, res) => {
    const ID = req.params.id
    //console.log(ID);
    try {
        let reqData=await Bookingmodel.find({_id:ID});
        let specificDate = new Date(`${reqData[0].bookingDate}`);
        let currentDate = new Date();
        if(currentDate>specificDate){
            return res.json({"msg":"Consulatation already done"})
        }else{
            let timeDiff = Math.abs(currentDate.getTime() - specificDate.getTime());
            let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(daysDiff>=1){
                await Bookingmodel.findByIdAndDelete({ _id: ID });
                res.json({ "msg": `Booking for ID  ${ID} cancelled succesfully` })
            }else{
                return res.json({"msg":"Our cancellation policy requires a minimum one-day notice for booking deletions."})
            }
            
        }
        
    } catch (error) {
        console.log("error from deleting booking data", error.message);
        res.json({ "msg": "error in deleting of booking data", "errorMsg": error.message })
    }
})


//4.GetAll Appointments by Doctor Id And Date
bookingRouter.get("/all-doctorId",async (req, res) => {
    let doctorId = req.body.doctorId;
    let bookingDate = req.body.bookingDate;
    
    try {    
            const reqData = await Bookingmodel.find({ doctorId,bookingDate });
            res.json({" msg": `Appointments by Doctor Id ${doctorId} and date ${bookingDate}`, "Data": reqData })
        }
    catch (error) {
        console.log("error from getting appointment details by Doctor Id", error.message);
        res.json({ "msg": "error in getting appointment details by Doctor Id", "errorMsg": error.message })
    }
})

//4. GetAll Appointments by Specialization And Date
bookingRouter.get("/all-specialization",async (req, res) => {
    let expertise = req.body.expertise;
    let bookingDate = req.body.bookingDate;
    
    try {    
            const reqData = await Bookingmodel.find({bookingDate,expertise });
            res.json({" msg": `Appointments by Specialization ${expertise} and date ${bookingDate}`, "Data": reqData })
        }
    catch (error) {
        console.log("error from getting appointment details by Specialization", error.message);
        res.json({ "msg": "error in getting appointment details by Doctor Id", "errorMsg": error.message })
    }
})

//5.getting paticular user booking data
bookingRouter.get("/paticularUser",async (req, res) => {
    let userId = req.body.userId;
    
    try {    
            const reqData = await Bookingmodel.find({ userId });
            res.json({" msg": `All booking data of userId ${userId}`, "Data": reqData })
        }
    catch (error) {
        console.log("error from getting paticular user booking data", error.message);
        res.json({ "msg": "error in getting paticular user booking data", "errorMsg": error.message })
    }
})
module.exports = {
    bookingRouter
}
