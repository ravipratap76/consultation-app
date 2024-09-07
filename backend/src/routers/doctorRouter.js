const express= require("express");
const fs=require("fs");
const {Doctormodel} =require("../models/doctorModel");
const { Bookingmodel } = require("../models/bookingModel");

const doctorRouter=express.Router();

//1.OnboardDoctor
doctorRouter.post("/onboard",async(req,res)=>{
    const {name,expertise,slotsPerDay,delflg}=req.body;
    try {
            let onboardData=new Doctormodel({name,expertise,slotsPerDay,delflg});
            await onboardData.save();
            res.json({"msg":"Doctor Onboarded Successfully",onboardData})
    } catch (error) {
        console.log("error from doctor route while onboarding doctor",error);
        res.json({"msg":"error  while onboarding doctor"})
    }
})

//2.DeboardDoctor
// doctorRouter.delete('/deboard/:id', async (req, res) => {
//     try {
//         const doctor = await Doctormodel.findByIdAndDelete(req.params.id)
//         res.json({"msg":"User deleted ","data":doctor})
//         } catch (error) {
//             console.log("error from getting  doctor route",error);
//             res.json({"msg":"error while deleting doctors details"})
//         }
// })

//2.Deboard Doctor
doctorRouter.patch('/deboard', async (req, res) => {
    const {doctorId,delflg}=req.body;
    try {
        let doctor=await Doctormodel.find({_id: doctorId})
        if(doctor[0].delflg==='Y'){
            res.json({ "msg": `Doctor Id ${doctorId} already deboarded ` })
            return;
        }
         await Doctormodel.findByIdAndUpdate(doctorId,{delflg})
         let doctorData =await Doctormodel.find({_id: doctorId},{name:true,expertise:true,slotsPerDay:true})
        res.json({"msg":`Doctor Id ${doctorId} Deboarded Successfully`,"data":doctorData})
    } catch (error) {
        console.log("error from getting detail doctor route",error);
        res.json({"msg":"error while getting detail of doctor for deboard"})
    }
})

//3.UpdateDoctor 
doctorRouter.patch('/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'expertise', 'slotsPerDay']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {

        let checkDoctor=await Doctormodel.find({_id: req.params.id})
        if(checkDoctor[0].delflg==='Y'){
            res.json({ "msg": `Can not update,Doctor Id ${req.params.id} is deleted ` })
            return;
        }
        let doctor = await Doctormodel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.json({"msg":"Doctor Details Updated ","data":doctor})
    } catch (error) {
        console.log("error from getting details in doctor route while Update",error);
        res.json({"msg":"error while updating doctors details "})
    }
})

//4.Get all the doctors
doctorRouter.get("/all",async(req,res)=>{
    try {
        let allDoctor=await Doctormodel.find()
        console.log(allDoctor)
        res.json({"msg":"All doctors details","data":allDoctor})
    } catch (error) {
        console.log("error from getting all doctor route",error);
        res.json({"msg":"error while getting all doctors details"})
    }
}) 

//4.1 List Doctors (By expertise)
doctorRouter.get("/all/expertise/:value",async(req,res)=>{
    let expertise=req.params.value;
    //console.log(expertise)
    try {
        let allDoctor=await Doctormodel.find({expertise})
        res.json({"msg":"All doctors details based on expertise","data":allDoctor})
    } catch (error) {
        console.log("error from getting all doctor route",error);
        res.json({"msg":"error while getting all doctors details based on expertise"})
    }
})

//5.GetAvailable Slots By Doctor Id And Date
doctorRouter.get("/slots/available",async(req,res)=>{
    let doctorId = req.body.doctorId;
    let date = req.body.date;
    try {
        let doctor=await Doctormodel.find({_id: doctorId})
        console.log(doctor)
        if(doctor.length===0){
            return res.json({"msg":"Invalid Doctor Id"})
        }
        let slotsPerDay=doctor[0].slotsPerDay
        let allBooking=await Bookingmodel.find({doctorId: doctorId,bookingDate:date})
        let availableSlots=slotsPerDay-allBooking.length
        res.json({"msg":`Available Slots By Doctor Id ${doctorId} And Date ${date}`,"data":availableSlots})
    } catch (error) {
        console.log("error from getting all Slots By Doctor Id",error);
        res.json({"msg":"error from getting all Slots By Doctor Id"})
    }
})

//5.GetAvailable Slots By Specialization And Date
doctorRouter.get("/expertise/slots/available",async(req,res)=>{
    let expertise = req.body.expertise;
    let date = req.body.date;
    try {
        let allDoctors=await Doctormodel.find({expertise: expertise})
        //console.log(allDoctors)
        let slotsPerDay;
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
    doctorRouter
}
