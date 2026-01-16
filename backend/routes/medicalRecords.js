const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { verifyToken } = require('./auth');

// Create medical record
router.post('/', verifyToken, async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get records by patient
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all records
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find().populate('patientId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get record by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate('patientId');
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update record
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete record
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
