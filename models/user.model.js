const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  agreeTerms: { type: Boolean, required: true },
  donateBlood: { type: Boolean, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
