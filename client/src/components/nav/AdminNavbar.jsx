import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-xl font-bold text-white no-underline">
            Family Memory Admin
          </Link>
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold">Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-300 md:block">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
