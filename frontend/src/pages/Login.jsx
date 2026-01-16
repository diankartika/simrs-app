import React, { useState } from 'react';
import { authAPI } from '../api';
import { CheckCircle, Zap, Shield, Brain } from 'lucide-react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-4">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left side - Features & Copywriting */}
          <div className="text-center lg:text-left hidden lg:block space-y-8">
            {/* Logo & Title */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-3 rounded-xl">
                  <Brain className="text-white" size={32} />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">SIMRS</h1>
                  <p className="text-sm text-gray-600 font-medium">Smart Medical Records</p>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Medical Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Made Smart</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Intelligent diagnosis matching, automated SNOMED-CT mapping, dan quality assurance yang terverifikasi. Semua dalam satu sistem yang powerful.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Auto-Mapping</h3>
                  <p className="text-gray-600 text-sm">ICD-10 & ICD-9-CM otomatis di-mapping ke SNOMED-CT dengan akurasi tinggi</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Brain className="text-teal-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Intelligent Validation</h3>
                  <p className="text-gray-600 text-sm">AI-powered diagnosis matching & semantic validation untuk quality control yang akurat</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Verified Accuracy</h3>
                  <p className="text-gray-600 text-sm">Real-time insights untuk memastikan coding sesuai standar internasional</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Streamlined Workflow</h3>
                  <p className="text-gray-600 text-sm">Dokter, coder, auditor bekerja seamlessly dalam satu platform unified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 backdrop-blur-sm">
              
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-3 rounded-xl">
                    <Brain className="text-white" size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600">SIMRS</h1>
                    <p className="text-xs text-gray-600">Smart Medical Records</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Medical Coding Made Smart</h2>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan username Anda"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan password Anda"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 font-medium text-sm flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Sedang login...
                    </span>
                  ) : (
                    'Login to SIMRS'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 font-medium">Demo Credentials</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Demo Credentials */}
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1">
                        Admin / QC
                      </p>
                      <p className="text-sm font-medium text-gray-900">admin</p>
                      <p className="text-sm text-gray-700">admin</p>
                    </div>
                    <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold">
                      Full Access
                    </span>
                  </div>
                </div>
              </div>


              {/* Footer Note */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-700 text-center">
                  <span className="font-semibold text-gray-900">Pro Tip:</span> Setelah login, kamu bisa akses semua role (Dokter, Coder, Auditor, Admin) via tabs. Satu login, unlimited possibilities.
                </p>
              </div>
            </div>

            {/* Trust Info */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-medium mb-3">
                Trusted by Healthcare Institutions
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-xs bg-gray-50 rounded px-3 py-2 text-gray-700 font-medium shadow-sm">
                  SNOMED-CT Certified
                </span>
                <span className="text-xs bg-gray-50 rounded px-3 py-2 text-gray-700 font-medium shadow-sm">
                  ICD Standard
                </span>
                <span className="text-xs bg-gray-50 rounded px-3 py-2 text-gray-700 font-medium shadow-sm">
                  HIPAA Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Login;
