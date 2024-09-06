const express= require("express");
const fs=require("fs");
const {Usermodel} =require("../models/userModel");
const { Bookingmodel } = require("../models/bookingModel");

const userRouter=express.Router();

//1.OnboardDoctor
userRouter.post("/register",async(req,res)=>{
    const {name,expertise,slotsPerDay}=req.body;
    try {
            let registerData=new Usermodel({name,expertise,slotsPerDay});
            await registerData.save();
            res.json({"msg":"Successfully register"})
    } catch (error) {
        console.log("error from register route",error);
        res.json({"msg":"error in register a user"})
    }
})

//2.DeboardDoctor
userRouter.delete('/doctor/:id', async (req, res) => {
    try {
        const doctor = await Usermodel.findByIdAndDelete(req.params.id)
        res.json({"msg":"User deleted ","data":doctor})
        } catch (error) {
            console.log("error from getting  doctor route",error);
            res.json({"msg":"error while deleting doctors details"})
        }
})

//3.UpdateDoctor 
userRouter.patch('/doctor/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'expertise', 'slotsPerDay']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const doctor = await Usermodel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.json({"msg":"User Updated ","data":doctor})
    } catch (error) {
        console.log("error from getting all doctor route",error);
        res.json({"msg":"error while getting all doctors details based on expertise"})
    }
})

//4.Get all the doctors
userRouter.get("/doctors",async(req,res)=>{
    try {
        let allDoctor=await Usermodel.find()
        console.log(allDoctor)
        res.json({"msg":"All doctors details","data":allDoctor})
    } catch (error) {
        console.log("error from getting all doctor route",error);
        res.json({"msg":"error while getting all doctors details"})
    }
}) 

//4.1 List Doctors (By expertise)
userRouter.get("/doctors/expertise/:value",async(req,res)=>{
    let expertise=req.params.value;
    //console.log(expertise)
    try {
        let allDoctor=await Usermodel.find({expertise})
        res.json({"msg":"All doctors details based on expertise","data":allDoctor})
    } catch (error) {
        console.log("error from getting all doctor route",error);
        res.json({"msg":"error while getting all doctors details based on expertise"})
    }
})

//5.GetAvailable Slots By Doctor Id And Date
userRouter.get("/doctor/slots/available",async(req,res)=>{
    let doctorId = req.body.doctorId;
    let date = req.body.date;
    try {
        let doctor=await Usermodel.find({_id: doctorId})
        let slotsPerDay=doctor[0].slotsPerDay
        //console.log(slotsPerDay)
        let allBooking=await Bookingmodel.find({doctorId: doctorId,bookingDate:date})
        let availableSlots=slotsPerDay-allBooking.length
        res.json({"msg":`Available Slots By Doctor Id ${doctorId} And Date ${date}`,"data":availableSlots})
    } catch (error) {
        console.log("error from getting all Slots By Doctor Id",error);
        res.json({"msg":"error from getting all Slots By Doctor Id"})
    }
})

//5.GetAvailable Slots By Specialization And Date
userRouter.get("/doctor/specialization/slots/available",async(req,res)=>{
    let expertise = req.body.expertise;
    let date = req.body.date;
    try {
        let allDoctors=await Usermodel.find({expertise: expertise})
        let slotsPerDay=0
        for(let i=0;i<allDoctors.length;i++){
            slotsPerDay=slotsPerDay+allDoctors[i].slotsPerDay
        }
        //console.log(slotsPerDay)
        let allBooking=await Bookingmodel.find({expertise: expertise,bookingDate:date})
        let availableSlots=slotsPerDay-allBooking.length
        res.json({"msg":`Available Slots By BySpecialization ${expertise} And Date ${date}`,"data":availableSlots})
    } catch (error) {
        console.log("error from getting all Slots BySpecialization",error);
        res.json({"msg":"error from getting all Slots By Specialization"})
    }
})
module.exports={
    userRouter
}
