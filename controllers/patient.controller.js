const Patient = require('../models/patient.model');

// Register a new patient
const registerPatient = async (req, res) => {
  try {
    const { fullName, aadhaar, mobile, bloodGroup, details } = req.body;
    const existingPatient = await Patient.findOne({ aadhaar });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: 'Aadhaar number already registered.' });
    }

    const newPatient = new Patient({
      fullName,
      aadhaar,
      mobile,
      bloodGroup,
      details,
    });
    await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully!' });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Get all registered patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully!' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
};

module.exports = {
  registerPatient,
  getAllPatients,
  deletePatient,
};
