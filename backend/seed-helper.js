const Patient = require('./models/Patient');
const MedicalRecord = require('./models/MedicalRecord');
const MedicalCoding = require('./models/MedicalCoding');

// Case Studies Data
const caseStudies = [
  {
    patient: {
      patientNo: 'RM001',
      nik: '1234567890123456',
      name: 'Budi Santoso',
      dateOfBirth: new Date('1970-05-15'),
      gender: 'Laki-laki',
      address: 'Jl. Merdeka No. 45, Purwokerto',
      phone: '081234567890',
      email: 'budi@email.com',
      education: 'S1',
      occupation: 'Karyawan Swasta',
      visitType: 'Ranap',
      insuranceType: 'BPJS',
      insuranceNo: 'BPJ123456789'
    },
    medicalRecord: {
      chiefComplaint: 'Benjolan di anus dan perubahan pola defekasi',
      historyOfPresent: 'Pasien mengeluh benjolan di anus sejak 3 bulan lalu, disertai perubahan pola buang air besar',
      pastMedicalHistory: 'Tidak ada riwayat penyakit serius sebelumnya',
      assessment: 'Kanker rektum dengan tipe mucinous adenocarcinoma',
      diagnosis: 'Malignant neoplasm of rectum type mucinous adenocarcinoma',
      treatment: 'Kemoterapi infusi',
      doctor: 'Dr. Ahmad Wijaya',
      physicalExamination: {
        bloodPressure: '130/80',
        temperature: 36.8,
        heartRate: 82,
        respiratoryRate: 18,
        findings: 'Benjolan di rektum, nyeri pada daerah perianal'
      },
      medication: [
        { drugName: 'Cisplatin', dosage: '75 mg/m2', frequency: 'Setiap 3 minggu', duration: '4 siklus' },
        { drugName: '5-Fluorouracil', dosage: '500 mg/m2', frequency: 'Harian', duration: '5 hari' },
        { drugName: 'Metoclopramide', dosage: '10 mg', frequency: '3x sehari', duration: '14 hari' }
      ],
      supportingTests: [
        { testName: 'CT Scan Abdomen', result: 'Massa rektum dengan ukuran 5x4 cm', date: new Date('2025-11-10') },
        { testName: 'Biopsi Rektum', result: 'Adenokarsinoma musinosa', date: new Date('2025-11-10') }
      ],
      recordDate: new Date('2025-11-10')
    },
    coding: {
      diagnosis: {
        clinicalDiagnosis: 'Malignant neoplasm of rectum type mucinous adenocarcinoma',
        icd10Code: 'C20.9',
        icd10Description: 'Malignant neoplasm of rectum',
        snomedCTCode: '363351',
        snomedCTDisplay: 'Disorder',
        primary: true
      },
      procedure: {
        procedureName: 'Infusion chemotherapy for malignant neoplasm',
        icd9cmCode: '99.25',
        icd9cmDescription: 'Infusion of chemotherapeutic agent',
        snomedCTCode: '38216008',
        snomedCTDisplay: 'Procedure'
      }
    }
  },
  {
    patient: {
      patientNo: 'RM002',
      nik: '1234567890123457',
      name: 'Rinto Hadiana',
      dateOfBirth: new Date('2010-03-20'),
      gender: 'Laki-laki',
      address: 'Jl. Ahmad Yani No. 23, Purwokerto',
      phone: '081234567891',
      email: 'rinto@email.com',
      education: 'SMA',
      occupation: 'Pelajar',
      visitType: 'Ranap',
      insuranceType: 'BPJS',
      insuranceNo: 'BPJ123456790'
    },
    medicalRecord: {
      chiefComplaint: 'Sesak nafas dan batuk berkepanjangan',
      historyOfPresent: 'Pasien usia 15 tahun mengalami sesak nafas sejak 2 minggu lalu, disertai batuk yang tidak kunjung sembuh',
      pastMedicalHistory: 'Tidak ada riwayat penyakit serius',
      assessment: 'Teratoma maligna paru dengan gejala respiratory distress',
      diagnosis: 'Primary malignant neoplasm of lower lobe, bronchus or lung',
      treatment: 'Oksigen terapi dan kemoterapi',
      doctor: 'Dr. Siti Nurhaliza',
      physicalExamination: {
        bloodPressure: '110/70',
        temperature: 37.2,
        heartRate: 98,
        respiratoryRate: 24,
        findings: 'Wheezing pada paru kanan, sesak nafas'
      },
      medication: [
        { drugName: 'Oksigen', dosage: '2-4 L/menit', frequency: 'Berkelanjutan', duration: '7 hari' },
        { drugName: 'Chemotherapy Agent', dosage: 'Sesuai protokol', frequency: '1x', duration: '1 hari' }
      ],
      supportingTests: [
        { testName: 'Chest X-Ray', result: 'Massa pada lobus bawah paru kanan', date: new Date('2025-09-25') },
        { testName: 'CT Scan Thorax', result: 'Teratoma maligna ukuran 6x5 cm', date: new Date('2025-09-25') }
      ],
      recordDate: new Date('2025-09-25')
    },
    coding: {
      diagnosis: {
        clinicalDiagnosis: 'Primary malignant neoplasm of lower lobe, bronchus or lung',
        icd10Code: 'C34.3',
        icd10Description: 'Malignant neoplasm of lower lobe, unspecified',
        snomedCTCode: '372110008',
        snomedCTDisplay: 'Disorder',
        primary: true
      },
      procedure: {
        procedureName: 'Oxygen therapy and Computed tomography of chest',
        icd9cmCode: '93.96',
        icd9cmDescription: 'Hyperbaric oxygen and other oxygen therapy',
        snomedCTCode: '57485005',
        snomedCTDisplay: 'Procedure'
      }
    }
  },
  {
    patient: {
      patientNo: 'RM003',
      nik: '1234567890123458',
      name: 'Siti Nur Azizah',
      dateOfBirth: new Date('1985-07-12'),
      gender: 'Perempuan',
      address: 'Jl. Sudirman No. 78, Purwokerto',
      phone: '081234567892',
      email: 'siti@email.com',
      education: 'S1',
      occupation: 'Guru',
      visitType: 'Ranap',
      insuranceType: 'BPJS',
      insuranceNo: 'BPJ123456791'
    },
    medicalRecord: {
      chiefComplaint: 'Bengkak pada area testis dan nyeri',
      historyOfPresent: 'Pasien dengan diagnosis kanker testis dating untuk menjalani kemoterapi',
      pastMedicalHistory: 'Operasi orkhiektomi sudah dilakukan 2 bulan sebelumnya',
      assessment: 'Malignant neoplasm testis post operasi, siap untuk kemoterapi',
      diagnosis: 'Malignant neoplasm of testis',
      treatment: 'Kemoterapi sistemik',
      doctor: 'Dr. Bambang Sutrisno',
      physicalExamination: {
        bloodPressure: '120/75',
        temperature: 36.5,
        heartRate: 80,
        respiratoryRate: 16,
        findings: 'Pasien dalam kondisi stabil, bekas operasi sudah menutup'
      },
      medication: [
        { drugName: 'Bleomycin', dosage: '30 Unit', frequency: '1x seminggu', duration: '9 minggu' },
        { drugName: 'Etoposide', dosage: '100 mg/m2', frequency: 'Setiap hari', duration: '5 hari' },
        { drugName: 'Cisplatin', dosage: '20 mg/m2', frequency: 'Setiap hari', duration: '5 hari' }
      ],
      supportingTests: [
        { testName: 'Tumor Markers (AFP, hCG)', result: 'AFP 2.5 ng/mL, hCG <1 mIU/mL', date: new Date('2025-11-11') },
        { testName: 'CT Scan Abdomen & Pelvis', result: 'Tidak ada metastasis yang terlihat', date: new Date('2025-11-11') }
      ],
      recordDate: new Date('2025-11-11')
    },
    coding: {
      diagnosis: {
        clinicalDiagnosis: 'Malignant neoplasm of testis',
        icd10Code: 'C62.9',
        icd10Description: 'Malignant neoplasm of unspecified part of testis',
        snomedCTCode: '363418001',
        snomedCTDisplay: 'Disorder',
        primary: true
      },
      procedure: {
        procedureName: 'Systemic chemotherapy infusion',
        icd9cmCode: '99.25',
        icd9cmDescription: 'Infusion of chemotherapeutic agent',
        snomedCTCode: '38216008',
        snomedCTDisplay: 'Procedure'
      }
    }
  },
  {
    patient: {
      patientNo: 'RM004',
      nik: '1234567890123459',
      name: 'Sri Lestari',
      dateOfBirth: new Date('1961-12-08'),
      gender: 'Perempuan',
      address: 'Jl. Gatot Subroto No. 34, Purwokerto',
      phone: '081234567893',
      email: 'sri@email.com',
      education: 'SMP',
      occupation: 'Ibu Rumah Tangga',
      visitType: 'Ranap',
      insuranceType: 'BPJS',
      insuranceNo: 'BPJ123456792'
    },
    medicalRecord: {
      chiefComplaint: 'Tekanan darah tinggi, edema, dan gejala preeklampsia berat',
      historyOfPresent: 'Pasien usia 64 tahun dengan hipertensi dan diabetes datang dengan gejala preeklampsia berat',
      pastMedicalHistory: 'DM tipe 2 sudah 15 tahun',
      assessment: 'Severe preeclampsia dengan congestive heart failure',
      diagnosis: 'Severe Preeclampsia dengan Gagal Jantung Kongestif',
      treatment: 'Magnesium sulfat, antihipertensi, dan terapi jantung',
      doctor: 'Dr. Fatimah Zahra',
      physicalExamination: {
        bloodPressure: '180/120',
        temperature: 37.5,
        heartRate: 95,
        respiratoryRate: 22,
        findings: 'Edema wajah dan ekstremitas, krepitasi paru bilateral'
      },
      medication: [
        { drugName: 'Magnesium Sulfat', dosage: '4 gram IV loading', frequency: '1x', duration: '1 hari' },
        { drugName: 'Nifedipin', dosage: '10 mg', frequency: '3x sehari', duration: '5 hari' },
        { drugName: 'Insulin', dosage: 'Disesuaikan', frequency: '2x sehari', duration: 'Berkelanjutan' }
      ],
      supportingTests: [
        { testName: 'Urinalisis', result: 'Proteinuria 3+', date: new Date('2025-11-09') },
        { testName: 'Echocardiography', result: 'EF 35%, signs of heart failure', date: new Date('2025-11-09') }
      ],
      recordDate: new Date('2025-11-09')
    },
    coding: {
      diagnosis: {
        clinicalDiagnosis: 'Severe Preeclampsia dengan Gagal Jantung Kongestif',
        icd10Code: 'O14.1',
        icd10Description: 'Severe pre-eclampsia',
        snomedCTCode: '105651000119100',
        snomedCTDisplay: 'Situation',
        primary: true
      },
      procedure: {
        procedureName: 'Oxygen therapy and Insulin injection',
        icd9cmCode: '99.15',
        icd9cmDescription: 'Parenteral infusion of concentrated nutritional supplement',
        snomedCTCode: '67866001',
        snomedCTDisplay: 'Substance'
      }
    }
  },
  {
    patient: {
      patientNo: 'RM005',
      nik: '1234567890123460',
      name: 'Dewi Maharani',
      dateOfBirth: new Date('1993-04-18'),
      gender: 'Perempuan',
      address: 'Jl. Pendidikan No. 56, Purwokerto',
      phone: '081234567894',
      email: 'dewi@email.com',
      education: 'S1',
      occupation: 'Perawat',
      visitType: 'Rajal',
      insuranceType: 'BPJS',
      insuranceNo: 'BPJ123456793'
    },
    medicalRecord: {
      chiefComplaint: 'Nyeri saat buang air kecil dan demam',
      historyOfPresent: 'Pasien usia 32 tahun mengeluh nyeri saat buang air kecil sejak 3 hari, disertai demam',
      pastMedicalHistory: 'Tidak ada riwayat penyakit serius',
      assessment: 'Acute cystitis dengan infeksi E. coli',
      diagnosis: 'Acute cystitis, Urinary tract infection, Escherichia coli',
      treatment: 'Antibiotik dan analgesik',
      doctor: 'Dr. Yuni Setiawati',
      physicalExamination: {
        bloodPressure: '115/75',
        temperature: 38.5,
        heartRate: 85,
        respiratoryRate: 18,
        findings: 'Nyeri CVA (Costovertebral Angle), demam'
      },
      medication: [
        { drugName: 'Ciprofloxacin', dosage: '500 mg', frequency: '2x sehari', duration: '7 hari' },
        { drugName: 'Paracetamol', dosage: '500 mg', frequency: '3x sehari', duration: '3 hari' }
      ],
      supportingTests: [
        { testName: 'Urinalisis', result: 'Leukosit +3, Nitrit positif', date: new Date('2025-11-15') },
        { testName: 'Urin Kultur', result: 'E. coli', date: new Date('2025-11-15') }
      ],
      recordDate: new Date('2025-11-15')
    },
    coding: {
      diagnosis: {
        clinicalDiagnosis: 'Acute cystitis with E. coli infection',
        icd10Code: 'N39.0',
        icd10Description: 'Urinary tract infection, site not specified',
        snomedCTCode: '68226007',
        snomedCTDisplay: 'Disorder',
        primary: true
      },
      procedure: {
        procedureName: 'Laboratory test and Diagnostic ultrasound',
        icd9cmCode: '88.74',
        icd9cmDescription: 'Ultrasound of urinary system',
        snomedCTCode: '55052008',
        snomedCTDisplay: 'Procedure'
      }
    }
  }
];

// Seed function - returns promise, doesn't exit
async function seedDatabase() {
  try {
    // Check if data already exists
    const existingPatients = await Patient.countDocuments();
    
    if (existingPatients > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    let createdCount = 0;

    // Insert case studies
    for (const caseStudy of caseStudies) {
      try {
        // Create patient
        const patient = await Patient.create(caseStudy.patient);

        // Create medical record
        const medicalRecord = await MedicalRecord.create({
          ...caseStudy.medicalRecord,
          patientId: patient._id
        });

        // Create medical coding
        await MedicalCoding.create({
          ...caseStudy.coding,
          medicalRecordId: medicalRecord._id,
          codedBy: 'Auto Seed',
          validationStatus: 'Validated',
          validatedBy: 'System'
        });

        createdCount++;
      } catch (error) {
        console.error(`Error creating case: ${error.message}`);
      }
    }

    console.log(`✅ Database seeded with ${createdCount} case studies`);
    return true;

  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

module.exports = seedDatabase;
