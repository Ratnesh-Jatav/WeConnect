import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.adminLogin(formData);
      const { token, user } = response.data;
      login(user, token, 'admin');
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 p-5">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Admin Login</h1>
        <p className="mb-7 text-sm text-slate-500">Access the Admin Panel</p>

        <form onSubmit={handleSubmit} className="mb-5 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium text-slate-800">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium text-slate-800">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          User login? <a href="/login" className="font-semibold text-indigo-500 hover:underline">Click here</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
