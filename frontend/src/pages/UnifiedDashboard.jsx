import React, { useState, useEffect } from 'react';
import { patientAPI, medicalRecordAPI, codingAPI } from '../api';
import { Stethoscope, Clipboard, CheckCircle, BarChart3, Eye, Check, X, AlertCircle, Zap } from 'lucide-react';
import PatientRegistration from './PatientRegistration';

function UnifiedDashboard({ activeRole, setActiveRole }) {
  const [viewMode, setViewMode] = useState('list');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [codings, setCodings] = useState([]);
  const [showPreview, setShowPreview] = useState(null);
  const [notification, setNotification] = useState(null);
  const [auditChecklist, setAuditChecklist] = useState({
    formComplete: false,
    anamnesisFisik: false,
    diagnosisClinic: false,
    icd10Valid: false,
    icd9cmValid: false,
    snomedMapping: false,
    doctorSignature: false
  });

  const [newCoding, setNewCoding] = useState({
    diagnosis: { clinicalDiagnosis: '', icd10Code: '', icd10Description: '', snomedCTCode: '', snomedCTDisplay: '', primary: true },
    procedure: { procedureName: '', icd9cmCode: '', icd9cmDescription: '', snomedCTCode: '', snomedCTDisplay: '' },
    codedBy: ''
  });

  const [autoMappingResult, setAutoMappingResult] = useState(null);

  // RME Form State (FIXED)
  const [rmeForm, setRmeForm] = useState({
    chiefComplaint: '',
    diagnosis: '',
    treatment: '',
    bloodPressure: '',
    temperature: '',
    heartRate: ''
  });

  // ICD to SNOMED mapping
  const icdSnomedMapping = {
    'C20.9': { code: '363351', display: 'Malignant neoplasm of rectum', type: 'Disorder', keywords: ['cancer', 'rectum', 'colon'] },
    'C34.3': { code: '372110008', display: 'Malignant neoplasm of lower lobe lung', type: 'Disorder', keywords: ['cancer', 'lung', 'respiratory'] },
    'C62.9': { code: '363418001', display: 'Malignant neoplasm of testis', type: 'Disorder', keywords: ['cancer', 'testis', 'male'] },
    'N39.0': { code: '68226007', display: 'Urinary tract infection', type: 'Disorder', keywords: ['uti', 'infection', 'urinary'] },
    'O14.1': { code: '105651000119100', display: 'Severe preeclampsia', type: 'Situation', keywords: ['preeclampsia', 'pregnancy', 'hypertension'] },
    '99.25': { code: '38216008', display: 'Chemotherapy infusion', type: 'Procedure', keywords: ['chemotherapy', 'infusion', 'cancer'] },
    '99.04': { code: '5971006', display: 'Platelet transfusion', type: 'Procedure', keywords: ['transfusion', 'blood', 'platelet'] },
    '93.96': { code: '57485005', display: 'Oxygen therapy', type: 'Procedure', keywords: ['oxygen', 'therapy', 'respiratory'] }
  };

  // Smart validation function
  const validateCoding = (diagnosis, icd10, procedure, icd9cm, snomed) => {
    const issues = [];
    const matches = [];

    // Check diagnosis-ICD10 match
    const diagnosisKeywords = diagnosis.toLowerCase().split(/\s+/);
    const icd10Data = icdSnomedMapping[icd10];
    
    if (icd10Data) {
      const keywordMatch = diagnosisKeywords.some(word => 
        icd10Data.keywords.some(keyword => keyword.includes(word) || word.includes(keyword))
      );
      if (keywordMatch) {
        matches.push('✓ Diagnosis cocok dengan ICD-10');
      } else {
        issues.push('⚠ Diagnosis mungkin tidak sesuai dengan ICD-10 yang dipilih');
      }
    }

    // Check SNOMED mapping
    if (snomed && icd10Data && icd10Data.code === snomed) {
      matches.push('✓ SNOMED-CT mapping sesuai dengan ICD-10');
    } else if (snomed) {
      issues.push('⚠ SNOMED-CT mapping tidak sesuai dengan ICD-10');
    }

    // Check data completeness
    if (diagnosis && icd10 && snomed) {
      matches.push('✓ Data diagnosis & coding lengkap');
    } else {
      issues.push('⚠ Ada data yang belum lengkap');
    }

    return {
      valid: issues.length === 0 && matches.length >= 2,
      issues,
      matches,
      accuracy: Math.max(0, (matches.length / 3) * 100)
    };
  };

  // Show notification
  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [patientsRes, codingsRes] = await Promise.all([
        patientAPI.getAll(),
        codingAPI.getAll()
      ]);
      setPatients(patientsRes.data);
      setCodings(codingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const recordsRes = await medicalRecordAPI.getByPatient(patient._id);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSelectRecord = async (record) => {
    setSelectedRecord(record);
    try {
      const codingsRes = await codingAPI.getByRecord(record._id);
      setCodings(codingsRes.data);
    } catch (error) {
      console.error('Error fetching codings:', error);
    }
  };

  // FIXED: Save RME Function
  const handleSaveRME = async () => {
    if (!rmeForm.chiefComplaint || !rmeForm.diagnosis) {
      showNotif('⚠ Keluhan dan Diagnosis harus diisi!', 'error');
      return;
    }

    try {
      await medicalRecordAPI.create({
        patientId: selectedPatient._id,
        chiefComplaint: rmeForm.chiefComplaint,
        diagnosis: rmeForm.diagnosis,
        treatment: rmeForm.treatment,
        doctor: 'Dr. Admin',
        visitType: 'Rajal',
        physicalExamination: {
          bloodPressure: rmeForm.bloodPressure || '-',
          temperature: parseFloat(rmeForm.temperature) || 0,
          heartRate: parseInt(rmeForm.heartRate) || 0
        }
      });
      
      showNotif('✓ RME berhasil disimpan!', 'success');
      setRmeForm({
        chiefComplaint: '',
        diagnosis: '',
        treatment: '',
        bloodPressure: '',
        temperature: '',
        heartRate: ''
      });
      setViewMode('list');
      fetchAllData();
    } catch (error) {
      showNotif('Error: ' + error.message, 'error');
    }
  };

  const handleICD10Change = (code) => {
    setNewCoding(prev => ({
      ...prev,
      diagnosis: { ...prev.diagnosis, icd10Code: code }
    }));
    
    if (code && icdSnomedMapping[code]) {
      const mapping = icdSnomedMapping[code];
      setAutoMappingResult({
        from: code,
        snomedCode: mapping.code,
        snomedDisplay: mapping.display,
        type: mapping.type
      });
      setNewCoding(prev => ({
        ...prev,
        diagnosis: {
          ...prev.diagnosis,
          icd10Code: code,
          snomedCTCode: mapping.code,
          snomedCTDisplay: mapping.type
        }
      }));
    } else {
      setAutoMappingResult(null);
    }
  };

  const handleICD9CMChange = (code) => {
    setNewCoding(prev => ({
      ...prev,
      procedure: { ...prev.procedure, icd9cmCode: code }
    }));

    if (code && icdSnomedMapping[code]) {
      const mapping = icdSnomedMapping[code];
      setNewCoding(prev => ({
        ...prev,
        procedure: {
          ...prev.procedure,
          icd9cmCode: code,
          snomedCTCode: mapping.code,
          snomedCTDisplay: mapping.type
        }
      }));
    }
  };

  const handleSubmitCoding = async () => {
    try {
      await codingAPI.create({
        ...newCoding,
        medicalRecordId: selectedRecord._id
      });
      
      showNotif('✓ Pengkodean berhasil disimpan dan dikirim ke Auditor!', 'success');
      
      handleSelectRecord(selectedRecord);
      setNewCoding({
        diagnosis: { clinicalDiagnosis: '', icd10Code: '', icd10Description: '', snomedCTCode: '', snomedCTDisplay: '', primary: true },
        procedure: { procedureName: '', icd9cmCode: '', icd9cmDescription: '', snomedCTCode: '', snomedCTDisplay: '' },
        codedBy: ''
      });
      setAutoMappingResult(null);
      setViewMode('list');
    } catch (error) {
      showNotif('Error: ' + error.message, 'error');
    }
  };

  const handleValidate = async (codingId, status) => {
    try {
      await codingAPI.validate(codingId, { status, notes: '' });
      showNotif(`✓ Pengkodean ${status === 'Validated' ? 'disetujui' : 'ditolak'}!`, 'success');
      handleSelectRecord(selectedRecord);
      setAuditChecklist({
        formComplete: false,
        anamnesisFisik: false,
        diagnosisClinic: false,
        icd10Valid: false,
        icd9cmValid: false,
        snomedMapping: false,
        doctorSignature: false
      });
    } catch (error) {
      showNotif('Error: ' + error.message, 'error');
    }
  };

  // Notification component
  const Notification = () => {
    if (!notification) return null;
    
    return (
      <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        notification.type === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}>
        {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium">{notification.message}</span>
      </div>
    );
  };

  const roles = [
    { id: 'dokter', name: 'Dokter', icon: Stethoscope, color: 'blue' },
    { id: 'coder', name: 'Pengkodean Medis (HIM)', icon: Clipboard, color: 'purple' },
    { id: 'auditor', name: 'Auditor/QC', icon: CheckCircle, color: 'green' },
    { id: 'admin', name: 'Admin', icon: BarChart3, color: 'orange' }
  ];

  // ==================== HIM TAB ====================
  if (activeRole === 'coder') {
    return (
      <div>
        <Notification />
        
        {/* Role Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => { setActiveRole(role.id); setViewMode('list'); }}
              className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeRole === role.id
                  ? `border-purple-600 text-purple-600`
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <role.icon size={20} />
              {role.name}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 Portal Pengkodean Medis (HIM)</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-gray-600 text-sm">Total Rekam Medis</p>
              <p className="text-2xl font-bold text-purple-600">{medicalRecords.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-gray-600 text-sm">Belum Dikode</p>
              <p className="text-2xl font-bold text-yellow-600">{medicalRecords.filter(mr => !codings.some(c => c.medicalRecordId === mr._id)).length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-gray-600 text-sm">Sudah Dikode</p>
              <p className="text-2xl font-bold text-green-600">{medicalRecords.filter(mr => codings.some(c => c.medicalRecordId === mr._id)).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Rekam Medis untuk Dikode</h2>
            <div className="space-y-4">
              {medicalRecords.map(record => {
                const hasCoding = codings.some(c => c.medicalRecordId === record._id);
                return (
                  <div key={record._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{record.patientId?.name}</p>
                        <p className="text-sm text-gray-600">Diagnosis: {record.diagnosis}</p>
                        <p className="text-sm text-gray-500">Dokter: {record.doctor}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        hasCoding ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hasCoding ? 'Sudah Dikode' : 'Belum Dikode'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleSelectRecord(record);
                        setViewMode('coding');
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                    >
                      {hasCoding ? 'Edit Pengkodean' : 'Input Pengkodean'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {viewMode === 'coding' && selectedRecord && (
            <div className="mt-6 bg-white rounded-lg shadow p-6 space-y-6">
              <button
                onClick={() => setViewMode('list')}
                className="text-purple-600 hover:text-purple-800 mb-4"
              >
                ← Kembali
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🔢 Input Pengkodean</h2>

                {/* RME Summary (Read-only) */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">📄 Ringkasan RME Dokter (Read-Only)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Pasien:</p>
                      <p className="font-semibold text-gray-800">{selectedRecord.patientId?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dokter:</p>
                      <p className="font-semibold text-gray-800">Dr. {selectedRecord.doctor}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Keluhan Utama:</p>
                      <p className="font-semibold text-gray-800">{selectedRecord.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Diagnosis Klinis:</p>
                      <p className="font-semibold text-gray-800">{selectedRecord.diagnosis}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Penatalaksanaan:</p>
                      <p className="font-semibold text-gray-800">{selectedRecord.treatment}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Vital Signs:</p>
                      <p className="text-sm text-gray-800">
                        TD: {selectedRecord.physicalExamination?.bloodPressure} | 
                        Suhu: {selectedRecord.physicalExamination?.temperature}°C | 
                        HR: {selectedRecord.physicalExamination?.heartRate} bpm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coding Input */}
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-bold text-gray-800 mb-3">Diagnosis Coding</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Diagnosis Klinis</label>
                        <input
                          type="text"
                          value={newCoding.diagnosis.clinicalDiagnosis}
                          onChange={(e) => setNewCoding(prev => ({
                            ...prev,
                            diagnosis: { ...prev.diagnosis, clinicalDiagnosis: e.target.value }
                          }))}
                          placeholder="e.g., Malignant neoplasm"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ICD-10 Code</label>
                        <input
                          type="text"
                          value={newCoding.diagnosis.icd10Code}
                          onChange={(e) => handleICD10Change(e.target.value)}
                          placeholder="e.g., C20.9"
                          className="w-full border rounded px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>

                    {autoMappingResult && (
                      <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded flex items-start gap-2">
                        <Zap className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium text-green-900">✨ Auto-Mapping SNOMED-CT Berhasil</p>
                          <p className="text-sm text-green-700">{autoMappingResult.snomedCode}</p>
                          <p className="text-sm text-green-600">{autoMappingResult.snomedDisplay}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-bold text-gray-800 mb-3">Procedure/Tindakan</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nama Tindakan</label>
                        <input
                          type="text"
                          value={newCoding.procedure.procedureName}
                          onChange={(e) => setNewCoding(prev => ({
                            ...prev,
                            procedure: { ...prev.procedure, procedureName: e.target.value }
                          }))}
                          placeholder="e.g., Chemotherapy"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ICD-9-CM Code</label>
                        <input
                          type="text"
                          value={newCoding.procedure.icd9cmCode}
                          onChange={(e) => handleICD9CMChange(e.target.value)}
                          placeholder="e.g., 99.25"
                          className="w-full border rounded px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Petugas (HIM)</label>
                    <input
                      type="text"
                      value={newCoding.codedBy}
                      onChange={(e) => setNewCoding(prev => ({ ...prev, codedBy: e.target.value }))}
                      placeholder="Nama anda"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSubmitCoding}
                    className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                  >
                    Kirim ke Auditor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== AUDITOR TAB ====================
  if (activeRole === 'auditor') {
    const draftCodings = codings.filter(c => c.validationStatus === 'Draft');
    const validatedCodings = codings.filter(c => c.validationStatus === 'Validated');

    return (
      <div>
        <Notification />

        {/* Role Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => { setActiveRole(role.id); setViewMode('list'); }}
              className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeRole === role.id
                  ? `border-green-600 text-green-600`
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <role.icon size={20} />
              {role.name}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">✓ Portal Auditor / Quality Control</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-gray-600 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-red-600">{draftCodings.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600">{validatedCodings.length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-600 text-sm">Approval Rate</p>
              <p className="text-2xl font-bold text-blue-600">{codings.length > 0 ? Math.round((validatedCodings.length / codings.length) * 100) : 0}%</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Pending Review */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⏳ Pending Review ({draftCodings.length})</h2>
              {draftCodings.length === 0 ? (
                <p className="text-gray-500">Tidak ada pengkodean yang pending</p>
              ) : (
                <div className="space-y-4">
                  {draftCodings.map((coding) => {
                    const diagnosisFromCoding = coding.diagnosis?.clinicalDiagnosis || '';
                    const validation = validateCoding(
                      diagnosisFromCoding,
                      coding.diagnosis?.icd10Code,
                      coding.procedure?.procedureName,
                      coding.procedure?.icd9cmCode,
                      coding.diagnosis?.snomedCTCode
                    );

                    return (
                      <div key={coding._id} className="border rounded-lg p-4 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800">{coding.diagnosis?.clinicalDiagnosis}</p>
                            <p className="text-sm text-gray-600">ICD-10: {coding.diagnosis?.icd10Code}</p>
                            <p className="text-sm text-gray-600">Dikode oleh: {coding.codedBy}</p>
                          </div>
                          <button
                            onClick={() => setShowPreview(showPreview === coding._id ? null : coding._id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={20} />
                          </button>
                        </div>

                        {/* Smart Validation Insights */}
                        <div className={`p-3 rounded-lg border-l-4 ${
                          validation.valid 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-yellow-50 border-yellow-500'
                        }`}>
                          <div className="flex items-start gap-2">
                            {validation.valid ? (
                              <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                            ) : (
                              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                            )}
                            <div className="text-sm">
                              <p className={`font-bold ${validation.valid ? 'text-green-900' : 'text-yellow-900'}`}>
                                🔍 Insight Validasi: {
                                  validation.valid 
                                    ? 'Diagnosis, pengkodean, dan mapping SNOMED sudah sesuai standar dan terverifikasi ✓' 
                                    : 'Ada ketidaksesuaian yang perlu diperhatikan'
                                }
                              </p>
                              <ul className="mt-2 space-y-1">
                                {validation.matches.map((match, idx) => (
                                  <li key={idx} className={validation.valid ? 'text-green-700' : 'text-green-700'}>
                                    {match}
                                  </li>
                                ))}
                                {validation.issues.map((issue, idx) => (
                                  <li key={idx} className="text-yellow-700">
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        {showPreview === coding._id && (
                          <div className="mb-4 p-3 bg-gray-50 rounded text-sm space-y-2 border-l-4 border-blue-500">
                            <div>
                              <p className="font-semibold text-gray-700">Diagnosis:</p>
                              <p className="text-gray-600">ICD-10: <span className="font-mono font-bold">{coding.diagnosis?.icd10Code}</span></p>
                              <p className="text-gray-600">SNOMED-CT: <span className="font-mono font-bold text-green-600">{coding.diagnosis?.snomedCTCode}</span></p>
                            </div>
                            {coding.procedure?.icd9cmCode && (
                              <div>
                                <p className="font-semibold text-gray-700">Procedure:</p>
                                <p className="text-gray-600">ICD-9-CM: <span className="font-mono font-bold">{coding.procedure.icd9cmCode}</span></p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Checklist */}
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-sm font-bold text-gray-800 mb-3">📋 Checklist Verifikasi:</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {Object.entries(auditChecklist).map(([key, value]) => {
                              const labels = {
                                formComplete: '✓ Form Lengkap',
                                anamnesisFisik: '✓ Anamnesis & Fisik',
                                diagnosisClinic: '✓ Diagnosis Klinis',
                                icd10Valid: '✓ ICD-10 Valid',
                                icd9cmValid: '✓ ICD-9-CM Valid',
                                snomedMapping: '✓ SNOMED Mapping',
                                doctorSignature: '✓ Tanda Tangan Dokter'
                              };
                              
                              return (
                                <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => setAuditChecklist(prev => ({
                                      ...prev,
                                      [key]: e.target.checked
                                    }))}
                                    className="w-4 h-4 rounded"
                                  />
                                  <span className="text-gray-700">{labels[key]}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3 border-t">
                          <button
                            onClick={() => {
                              handleValidate(coding._id, 'Validated');
                              setShowPreview(null);
                            }}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                          >
                            <Check size={16} />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              handleValidate(coding._id, 'Rejected');
                              setShowPreview(null);
                            }}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Approved */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">✓ Approved ({validatedCodings.length})</h2>
              {validatedCodings.length === 0 ? (
                <p className="text-gray-500">Tidak ada pengkodean yang sudah approved</p>
              ) : (
                <div className="space-y-3">
                  {validatedCodings.map((coding) => (
                    <div key={coding._id} className="border rounded-lg p-3 bg-green-50">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800">{coding.diagnosis?.clinicalDiagnosis}</p>
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          <Check size={18} /> Approved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DOKTER & ADMIN ====================
  return (
    <div>
      <Notification />
      
      {/* Role Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => { setActiveRole(role.id); setViewMode('list'); }}
            className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeRole === role.id
                ? `border-blue-600 text-blue-600`
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <role.icon size={20} />
            {role.name}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {activeRole === 'dokter' && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍⚕️ Portal Dokter</h1>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm">Total Pasien</p>
                <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-600 text-sm">Rekam Medis</p>
                <p className="text-2xl font-bold text-green-600">{medicalRecords.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-gray-600 text-sm">Pending Coding</p>
                <p className="text-2xl font-bold text-purple-600">{codings.filter(c => c.validationStatus === 'Draft').length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-gray-600 text-sm">Validated</p>
                <p className="text-2xl font-bold text-orange-600">{codings.filter(c => c.validationStatus === 'Validated').length}</p>
              </div>
            </div>

            {viewMode === 'list' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setViewMode('register')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Daftar Pasien Baru
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Daftar Pasien</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">No. RM</th>
                          <th className="px-4 py-2 text-left">Nama</th>
                          <th className="px-4 py-2 text-left">NIK</th>
                          <th className="px-4 py-2 text-left">Tipe Kunjungan</th>
                          <th className="px-4 py-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {patients.map(patient => (
                          <tr key={patient._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium text-blue-600">{patient.patientNo}</td>
                            <td className="px-4 py-2">{patient.name}</td>
                            <td className="px-4 py-2">{patient.nik}</td>
                            <td className="px-4 py-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{patient.visitType}</span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => {
                                  handleSelectPatient(patient);
                                  setViewMode('record');
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Input RME
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'register' && (
              <div>
                <button
                  onClick={() => setViewMode('list')}
                  className="text-blue-600 hover:text-blue-800 mb-4"
                >
                  ← Kembali
                </button>
                <PatientRegistration onSuccess={() => { fetchAllData(); setViewMode('list'); }} />
              </div>
            )}

            {/* FIXED: RME Input Form with State Binding */}
            {viewMode === 'record' && selectedPatient && (
              <div>
                <button
                  onClick={() => setViewMode('list')}
                  className="text-blue-600 hover:text-blue-800 mb-4"
                >
                  ← Kembali ke Daftar Pasien
                </button>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Input Rekam Medis Elektronik</h2>
                  <p className="text-gray-600 mb-4">Pasien: <span className="font-bold">{selectedPatient.name}</span></p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block font-medium mb-2">Keluhan Utama *</label>
                      <input 
                        type="text" 
                        value={rmeForm.chiefComplaint}
                        onChange={(e) => setRmeForm(prev => ({...prev, chiefComplaint: e.target.value}))}
                        placeholder="e.g., Sakit kepala" 
                        className="w-full border rounded px-4 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Diagnosis *</label>
                      <input 
                        type="text" 
                        value={rmeForm.diagnosis}
                        onChange={(e) => setRmeForm(prev => ({...prev, diagnosis: e.target.value}))}
                        placeholder="e.g., Malignant neoplasm of rectum" 
                        className="w-full border rounded px-4 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Penatalaksanaan/Treatment</label>
                      <textarea 
                        value={rmeForm.treatment}
                        onChange={(e) => setRmeForm(prev => ({...prev, treatment: e.target.value}))}
                        placeholder="Pengobatan yang diberikan..." 
                        rows="3" 
                        className="w-full border rounded px-4 py-2" 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Tekanan Darah</label>
                        <input 
                          type="text" 
                          value={rmeForm.bloodPressure}
                          onChange={(e) => setRmeForm(prev => ({...prev, bloodPressure: e.target.value}))}
                          placeholder="e.g., 120/80" 
                          className="w-full border rounded px-4 py-2" 
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Suhu (°C)</label>
                        <input 
                          type="number" 
                          value={rmeForm.temperature}
                          onChange={(e) => setRmeForm(prev => ({...prev, temperature: e.target.value}))}
                          placeholder="e.g., 36.5" 
                          className="w-full border rounded px-4 py-2" 
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">HR (bpm)</label>
                        <input 
                          type="number" 
                          value={rmeForm.heartRate}
                          onChange={(e) => setRmeForm(prev => ({...prev, heartRate: e.target.value}))}
                          placeholder="e.g., 70" 
                          className="w-full border rounded px-4 py-2" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSaveRME}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Simpan RME
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeRole === 'admin' && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h1>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm">Total Pasien</p>
                <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-600 text-sm">Total RME</p>
                <p className="text-2xl font-bold text-green-600">{medicalRecords.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-gray-600 text-sm">Total Pengkodean</p>
                <p className="text-2xl font-bold text-purple-600">{codings.length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-gray-600 text-sm">Quality Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {codings.length > 0 ? Math.round((codings.filter(c => c.validationStatus === 'Validated').length / codings.length) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Status Pengkodean</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Draft (Pending)</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">
                      {codings.filter(c => c.validationStatus === 'Draft').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Validated</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                      {codings.filter(c => c.validationStatus === 'Validated').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Kunjungan Pasien</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rajal</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                      {patients.filter(p => p.visitType === 'Rajal').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ranap</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                      {patients.filter(p => p.visitType === 'Ranap').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UnifiedDashboard;
