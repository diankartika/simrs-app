const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const MedicalCoding = require('../models/MedicalCoding');
const { verifyToken } = require('./auth');

// Morbidity report - top 50 diseases
router.get('/morbidity', verifyToken, async (req, res) => {
  try {
    const morbidityReport = await MedicalCoding.aggregate([
      {
        $match: { validationStatus: 'Validated' }
      },
      {
        $group: {
          _id: '$diagnosis.icd10Code',
          description: { $first: '$diagnosis.icd10Description' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 50
      }
    ]);
    
    res.json(morbidityReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Procedures report
router.get('/procedures', verifyToken, async (req, res) => {
  try {
    const procedureReport = await MedicalCoding.aggregate([
      {
        $match: { validationStatus: 'Validated', 'procedure.icd9cmCode': { $exists: true } }
      },
      {
        $group: {
          _id: '$procedure.icd9cmCode',
          description: { $first: '$procedure.icd9cmDescription' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json(procedureReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quality report
router.get('/quality', verifyToken, async (req, res) => {
  try {
    const totalCodings = await MedicalCoding.countDocuments();
    const validatedCodings = await MedicalCoding.countDocuments({ validationStatus: 'Validated' });
    const rejectedCodings = await MedicalCoding.countDocuments({ validationStatus: 'Rejected' });
    const draftCodings = await MedicalCoding.countDocuments({ validationStatus: 'Draft' });
    
    res.json({
      total: totalCodings,
      validated: validatedCodings,
      rejected: rejectedCodings,
      draft: draftCodings,
      validationRate: totalCodings > 0 ? ((validatedCodings / totalCodings) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Patient visit summary
router.get('/patient-visits', verifyToken, async (req, res) => {
  try {
    const visitSummary = await Patient.aggregate([
      {
        $group: {
          _id: '$visitType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(visitSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF report (would use libraries like pdfkit)
router.post('/export', verifyToken, async (req, res) => {
  try {
    // Placeholder for PDF generation
    res.json({ message: 'PDF export functionality would be implemented here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
