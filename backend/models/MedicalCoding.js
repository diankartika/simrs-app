const mongoose = require('mongoose');

const MedicalCodingSchema = new mongoose.Schema({
  medicalRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true
  },
  
  // Diagnosis Coding
  diagnosis: {
    clinicalDiagnosis: String,
    icd10Code: String,
    icd10Description: String,
    snomedCTCode: String,
    snomedCTDisplay: String,
    primary: {
      type: Boolean,
      default: false
    }
  },
  
  // Action/Procedure Coding
  procedure: {
    procedureName: String,
    icd9cmCode: String,
    icd9cmDescription: String,
    snomedCTCode: String,
    snomedCTDisplay: String
  },
  
  // SNOMED-CT Extended
  snomedCT: {
    code: String,
    display: String,
    semanticTag: String // disorder, finding, procedure, substance, etc
  },
  
  // Validation Status
  validationStatus: {
    type: String,
    enum: ['Draft', 'Validated', 'Rejected'],
    default: 'Draft'
  },
  validationNotes: String,
  validatedBy: String,
  
  codedBy: {
    type: String,
    required: true
  },
  
  codingDate: {
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

module.exports = mongoose.model('MedicalCoding', MedicalCodingSchema);
