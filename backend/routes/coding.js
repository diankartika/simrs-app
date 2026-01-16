const express = require('express');
const router = express.Router();
const MedicalCoding = require('../models/MedicalCoding');
const { verifyToken } = require('./auth');

// Create coding
router.post('/', verifyToken, async (req, res) => {
  try {
    const coding = new MedicalCoding(req.body);
    await coding.save();
    res.status(201).json(coding);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get codings by medical record
router.get('/record/:recordId', verifyToken, async (req, res) => {
  try {
    const codings = await MedicalCoding.find({ medicalRecordId: req.params.recordId });
    res.json(codings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all codings
router.get('/', verifyToken, async (req, res) => {
  try {
    const codings = await MedicalCoding.find().populate('medicalRecordId');
    res.json(codings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get coding by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const coding = await MedicalCoding.findById(req.params.id).populate('medicalRecordId');
    if (!coding) {
      return res.status(404).json({ error: 'Coding not found' });
    }
    res.json(coding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update coding
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const coding = await MedicalCoding.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(coding);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Validate coding
router.patch('/:id/validate', verifyToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const coding = await MedicalCoding.findByIdAndUpdate(
      req.params.id,
      {
        validationStatus: status,
        validationNotes: notes,
        validatedBy: req.user.username,
        updatedAt: Date.now()
      },
      { new: true }
    );
    res.json(coding);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete coding
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await MedicalCoding.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coding deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ICD-10 suggestions (mock data - integrate with actual ICD-10 database)
router.get('/icd10/search/:query', verifyToken, async (req, res) => {
  // This would connect to ICD-10 database
  const mockCodes = [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'E11', description: 'Type 2 diabetes mellitus' },
    { code: 'J06', description: 'Acute upper respiratory infections' }
  ];
  res.json(mockCodes);
});

module.exports = router;
