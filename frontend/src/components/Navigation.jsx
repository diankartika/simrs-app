import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Navigation({ user, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold">
              🏥 SIMRS
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-blue-200 transition">Dashboard</Link>
              <Link to="/patients" className="hover:text-blue-200 transition">Pasien</Link>
              <Link to="/reports" className="hover:text-blue-200 transition">Laporan</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user?.username} ({user?.role})
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
