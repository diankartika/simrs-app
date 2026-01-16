const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  
  // Chief Complaint
  chiefComplaint: String,
  
  // History
  historyOfPresent: String,
  pastMedicalHistory: String,
  
  // Physical Examination
  physicalExamination: {
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    findings: String
  },
  
  // Assessment
  assessment: String,
  
  // Therapy
  diagnosis: String,
  treatment: String,
  medication: [{
    drugName: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  
  // Supplementary Tests
  supportingTests: [{
    testName: String,
    result: String,
    date: Date
  }],
  
  doctor: {
    type: String,
    required: true
  },
  
  recordDate: {
    type: Date,
    default: Date.now
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
