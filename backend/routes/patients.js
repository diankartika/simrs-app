const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { verifyToken } = require('./auth');

// Create patient
router.post('/', verifyToken, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all patients
router.get('/', verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete patient
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search patients by name or NIK
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const query = req.params.query;
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { nik: { $regex: query, $options: 'i' } },
        { patientNo: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
