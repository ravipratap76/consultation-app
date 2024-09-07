const express= require("express");
const fs=require("fs");
const { Bookingmodel } = require("../models/bookingModel");
const {Ratemodel} =require("../models/rateModel");

const earningRouter=express.Router();

//1.Earning by Doctor Id
earningRouter.get("/doctor",async(req,res)=>{
    try {
        let doctorId = req.body.doctorId;
        //let bookingDate = req.body.bookingDate;
        let allBooking=await Bookingmodel.find({doctorId},{bookingDate:true,expertise:true})
        //console.log(allBooking)
        let expertise=allBooking[0].expertise
        let expertiseRate=await Ratemodel.find({expertise})
        let totalEarning=expertiseRate[0].rate*allBooking.length
        //console.log(totalEarning)
        res.json({"msg":`Earning by Doctor Id ${doctorId}`,"data":allBooking,"totalIncome" :totalEarning })
    } catch (error) {
        console.log("error from getting all earning route",error);
        res.json({"msg":"error while getting earning details"})
    }
}) 

//Get Rates By expertise)
earningRouter.get("/specialization",async(req,res)=>{
    let specialization = req.body.expertise;
    //let bookingDate = req.body.bookingDate;
    try {
        let allBooking=await Bookingmodel.find({expertise:specialization},{bookingDate:true,expertise:true})
        let expertise=allBooking[0].expertise
        let expertiseRate=await Ratemodel.find({expertise})
        let totalEarning=expertiseRate[0].rate*allBooking.length
        res.json({"msg":`Earning by expertise  ${expertise}`,"data":allBooking,"totalIncome" :totalEarning})
    } catch (error) {
        console.log("error from getting all earning route",error);
        res.json({"msg":"error while getting earning based on expertise"})
    }
})

module.exports={
    earningRouter
}
