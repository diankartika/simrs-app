const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  // Identitas Pasien
  patientNo: {
    type: String,
    unique: true,
    required: true
  },
  nik: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'],
    required: true
  },
  address: String,
  phone: String,
  email: String,
  education: String,
  occupation: String,

  // Visit Information
  visitType: {
    type: String,
    enum: ['Rajal', 'Ranap', 'IGD'],
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  visitDate: Date,
  
  // Insurance Info
  insuranceType: String,
  insuranceNo: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
