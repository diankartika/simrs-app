import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../api';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await patientAPI.search(searchQuery);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setFilteredPatients(patients);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      try {
        await patientAPI.delete(id);
        setPatients(patients.filter(p => p._id !== id));
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const displayPatients = filteredPatients.length > 0 ? filteredPatients : patients;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Pasien</h1>
        <button
          onClick={() => navigate('/patients/register')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Pasien Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari pasien (nama, NIK, No. RM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : displayPatients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Tidak ada data pasien</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">No. RM</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">NIK</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tgl Lahir</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipe Kunjungan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{patient.patientNo}</td>
                    <td className="px-6 py-4">{patient.name}</td>
                    <td className="px-6 py-4">{patient.nik}</td>
                    <td className="px-6 py-4">
                      {new Date(patient.dateOfBirth).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {patient.visitType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/medical-records/${patient._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat rekam medis"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => navigate(`/patients/${patient._id}/edit`)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit pasien"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(patient._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus pasien"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 text-sm text-gray-600">
        Total Pasien: {displayPatients.length}
      </div>
    </div>
  );
}

export default PatientList;
