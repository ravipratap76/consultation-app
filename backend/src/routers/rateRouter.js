const express= require("express");
const fs=require("fs");
const {Ratemodel} =require("../models/rateModel");

const rateRouter=express.Router();

//1.Add new Expertise Rate
rateRouter.post("/add",async(req,res)=>{
    const {expertise,rate}=req.body;
    try {
            let addData=new Ratemodel({expertise,rate});
            await addData.save();
            res.json({"msg":"Successfully added"})
    } catch (error) {
        console.log("error from rate route",error);
        res.json({"msg":"error in expertise rate addition"})
    }
})

//2.Delete rate
rateRouter.delete('/delete/:id', async (req, res) => {
    try {
        const rate = await Ratemodel.findByIdAndDelete(req.params.id)
        res.json({"msg":"Rate deleted ","data":rate})
        } catch (error) {
            console.log("error from getting rate route",error);
            res.json({"msg":"error while deleting rate"})
        }
})

//3.Update Rate 
rateRouter.patch('/update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['expertise', 'rate']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const rate = await Ratemodel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.json({"msg":"Expertise Rate Updated ","data":rate})
    } catch (error) {
        console.log("error from getting all rate route",error);
        res.json({"msg":"error while getting all doctors details based on expertise"})
    }
})

//4.Get all Rate
rateRouter.get("/all",async(req,res)=>{
    try {
        console.log("hello rate")
        let allRates=await Ratemodel.find()
        console.log(allRates)
        res.json({"msg":"Rates","data":allRates})
    } catch (error) {
        console.log("error from getting all rate route",error);
        res.json({"msg":"error while getting rate details"})
    }
}) 

//Get Rates By expertise)
rateRouter.get("/:value",async(req,res)=>{
    let expertise=req.params.value;
    //console.log(expertise)
    try {
        let rate=await Ratemodel.find({expertise})
        res.json({"msg":`Rate of ${expertise}`,"data":rate})
    } catch (error) {
        console.log("error from getting all rate route",error);
        res.json({"msg":"error while getting rate based on expertise"})
    }
})

module.exports={
    rateRouter
}
