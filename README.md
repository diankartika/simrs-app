# 🏥 SIMRS - Sistem Informasi Manajemen Rumah Sakit

Web application untuk mengelola data pasien, rekam medis elektronik, dan pengkodean medis (ICD-10, ICD-9-CM, SNOMED-CT).

## 📋 Fitur Utama

### 1. **Manajemen Pasien**
- Registrasi pasien baru (Rajal, Ranap, IGD)
- Pencarian dan filter data pasien
- Pencatatan identitas lengkap (NIK, nama, DOB, dll)
- Manajemen data asuransi

### 2. **Rekam Medis Elektronik (RME)**
- Input data medis pasien:
  - Keluhan utama dan riwayat penyakit
  - Pemeriksaan fisik (tekanan darah, suhu, denyut jantung, dll)
  - Assessment dan diagnosis dokter
  - Treatment dan obat-obatan
  - Hasil pemeriksaan penunjang

### 3. **Pengkodean Medis**
- **ICD-10**: Pengkodean diagnosis
- **ICD-9-CM**: Pengkodean tindakan/prosedur
- **SNOMED-CT**: Terminologi klinis
- Validasi kode oleh petugas rekam medis
- Status: Draft → Validated/Rejected

### 4. **Laporan & Analisis**
- Laporan morbiditas (50 besar penyakit)
- Laporan tindakan medis
- Laporan kualitas data (validation rate)
- Ringkasan kunjungan pasien
- Export ke PDF/CSV

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Tools**: Mongoose, CORS, bcryptjs, dotenv

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
simrs-app/
├── backend/
│   ├── models/
│   │   ├── Patient.js           # Schema pasien
│   │   ├── MedicalRecord.js     # Schema rekam medis
│   │   └── MedicalCoding.js     # Schema pengkodean
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── patients.js          # Patient CRUD
│   │   ├── medicalRecords.js    # Medical records CRUD
│   │   ├── coding.js            # Coding management
│   │   └── reports.js           # Report generation
│   ├── .env                     # Environment variables
│   ├── server.js                # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx                # Login page
    │   │   ├── Dashboard.jsx            # Main dashboard
    │   │   ├── PatientRegistration.jsx  # Patient registration
    │   │   ├── PatientList.jsx          # Patient list
    │   │   ├── MedicalRecords.jsx       # Medical records
    │   │   ├── MedicalCoding.jsx        # Coding interface
    │   │   └── Reports.jsx              # Reports
    │   ├── components/
    │   │   └── Navigation.jsx           # Nav bar
    │   ├── api.js                       # API utilities
    │   ├── App.jsx                      # Main component
    │   └── index.js
    ├── tailwind.config.js
    ├── package.json
    └── public/
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+ dan npm/yarn
- MongoDB running (local atau cloud)
- Git

### 1. Clone Repository
```bash
git clone <repo-url>
cd simrs-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/simrs
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
EOF

# Start server
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin | Administrator |
| doctor | doctor | Doctor |
| medical_coder | coder | Medical Coder |

**⚠️ IMPORTANT**: Ubah ini di production!

## 📊 Database Schema

### Patient Collection
```javascript
{
  patientNo: String,          // No. RM
  nik: String,                // NIK
  name: String,               // Nama lengkap
  dateOfBirth: Date,
  gender: String,             // Laki-laki / Perempuan
  address: String,
  phone: String,
  email: String,
  education: String,
  occupation: String,
  visitType: String,          // Rajal / Ranap / IGD
  registrationDate: Date,
  insuranceType: String,
  insuranceNo: String
}
```

### MedicalRecord Collection
```javascript
{
  patientId: ObjectId,
  chiefComplaint: String,     // Keluhan utama
  historyOfPresent: String,
  pastMedicalHistory: String,
  physicalExamination: {
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    findings: String
  },
  assessment: String,
  diagnosis: String,          // Diagnosis dokter
  treatment: String,
  medication: Array,          // Daftar obat
  supportingTests: Array,     // Hasil pemeriksaan
  doctor: String,
  recordDate: Date
}
```

### MedicalCoding Collection
```javascript
{
  medicalRecordId: ObjectId,
  diagnosis: {
    clinicalDiagnosis: String,
    icd10Code: String,        // e.g., I10
    icd10Description: String,
    snomedCTCode: String,
    snomedCTDisplay: String,  // e.g., Disorder
    primary: Boolean
  },
  procedure: {
    procedureName: String,
    icd9cmCode: String,       // e.g., 93.00
    icd9cmDescription: String,
    snomedCTCode: String,
    snomedCTDisplay: String   // e.g., Procedure
  },
  validationStatus: String,   // Draft / Validated / Rejected
  validationNotes: String,
  validatedBy: String,
  codedBy: String,
  codingDate: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search/:query` - Search patients

### Medical Records
- `GET /api/medical-records` - Get all records
- `POST /api/medical-records` - Create record
- `GET /api/medical-records/patient/:patientId` - Get records by patient
- `GET /api/medical-records/:id` - Get record by ID
- `PUT /api/medical-records/:id` - Update record
- `DELETE /api/medical-records/:id` - Delete record

### Medical Coding
- `GET /api/coding` - Get all codings
- `POST /api/coding` - Create coding
- `GET /api/coding/record/:recordId` - Get codings by record
- `GET /api/coding/:id` - Get coding by ID
- `PUT /api/coding/:id` - Update coding
- `PATCH /api/coding/:id/validate` - Validate coding
- `DELETE /api/coding/:id` - Delete coding

### Reports
- `GET /api/reports/morbidity` - Morbidity report (top 50)
- `GET /api/reports/procedures` - Procedure report
- `GET /api/reports/quality` - Quality metrics
- `GET /api/reports/patient-visits` - Visit summary

## 🔄 Workflow

1. **Registrasi Pasien**: Admin/receptionist mendaftarkan pasien baru
2. **Input Rekam Medis**: Dokter mengisi rekam medis saat kunjungan
3. **Pengkodean**: Petugas rekam medis melakukan pengkodean dengan ICD-10, ICD-9-CM, SNOMED-CT
4. **Validasi**: Quality control/supervisor memvalidasi kode yang telah diinput
5. **Pelaporan**: Manajemen dapat melihat laporan morbiditas dan analisis

## 📈 Next Steps

### Yang dapat ditambahkan:
1. **Real ICD/SNOMED Database Integration**
   - Integrasi dengan WHO ICD-10 API
   - SNOMED-CT terminology server
   - Autocomplete untuk kode medis

2. **Advanced Features**
   - Multi-user role management
   - Audit trail untuk setiap perubahan
   - Digital signature untuk approval
   - Integration dengan BPJS/insurance systems

3. **Data Export**
   - Export to PDF dengan format resmi
   - Excel export untuk analisis lebih lanjut
   - HL7/FHIR export untuk interoperabilitas

4. **Performance**
   - Implement caching (Redis)
   - Pagination untuk large datasets
   - Full-text search untuk diagnosis

5. **Security**
   - Role-based access control (RBAC)
   - Encryption untuk data sensitif
   - Two-factor authentication
   - Data backup & disaster recovery

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Pastikan MongoDB running
mongod

# Atau gunakan MongoDB Atlas cloud
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/simrs
```

### CORS Error
Pastikan backend sudah import `cors`:
```javascript
const cors = require('cors');
app.use(cors());
```

### Port Already in Use
```bash
# Ubah PORT di .env atau
npx kill-port 5000
```

## 📝 License

MIT License - Feel free to use for educational/commercial purposes

## 👨‍💻 Author

Diannn - Product Manager at GAOGAO
SIMRS Capstone Project 2024

---

**Last Updated**: January 2026
**Status**: Development Ready
