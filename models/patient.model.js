const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
