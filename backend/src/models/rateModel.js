const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  expertise: { type: String, required: true },
  rate:{ type: Number, required: true }
});

const Ratemodel = mongoose.model('rate', rateSchema);

module.exports={Ratemodel}  
