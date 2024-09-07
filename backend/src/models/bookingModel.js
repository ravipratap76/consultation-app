const mongoose=require("mongoose");

const bookingSchema=mongoose.Schema({
    userId:{type:String,require:true},
    doctorId:{type:String,require:true},
    expertise:{type:String,require:true},
    bookingAmount:{type:Number,require:true},
    bookingDate:{type:String,require:true},
    bookingSlot:{type:String,require:true},
    status :{type:String,require:true},
    rescheduleCount:{type:Number,require:true}
},{timestamps:true})

const Bookingmodel=mongoose.model("booking",bookingSchema)

module.exports={Bookingmodel}