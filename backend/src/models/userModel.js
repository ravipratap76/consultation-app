const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise:{ type: String, required: true },
  slotsPerDay:{ type: Number, required: true },
});

const Usermodel = mongoose.model('user', userSchema);

module.exports={Usermodel}
