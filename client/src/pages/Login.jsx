import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await authService.login(formData);
      const { token, user } = response.data;
      login(user, token, 'user');
      toast.success('Login successful!');
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 p-5">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">Welcome</h1>
        <p className="mb-7 text-center text-sm text-slate-500">Access your family memories</p>

        <form onSubmit={handleSubmit} className="mb-5 space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account? <a href="/register" className="font-semibold text-indigo-500 hover:underline">Register here</a>
        </p>

        <div className="my-5 text-center text-xs font-semibold uppercase text-slate-300">or</div>

        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-100 p-2.5 text-center text-sm text-slate-500">
          <a href="/admin/login" className="font-bold text-red-600 hover:text-red-700">Admin Login</a>
        </p>

      </div>
    </div>
  );
};

export default Login;
