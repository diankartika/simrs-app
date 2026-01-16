const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto-seed database on startup (optional)
const autoSeed = process.env.AUTO_SEED === 'true';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Auto-seed if enabled
    if (autoSeed) {
      try {
        console.log('Starting auto-seed...');
        const seedDatabase = require('./seed-helper');
        await seedDatabase();
        console.log('✅ Auto-seed completed!');
      } catch (error) {
        console.log('ℹ️ Database already seeded or seed skipped');
      }
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/coding', require('./routes/coding'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
