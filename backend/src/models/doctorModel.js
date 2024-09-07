const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise:{ type: String, required: true },
  slotsPerDay:{ type: Number, required: true },
  delflg:{type: String, required: true}
},{timestamps:true});

const Doctormodel = mongoose.model('doctor', doctorSchema);

module.exports={Doctormodel}
