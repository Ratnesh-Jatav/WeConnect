import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      const response = await authService.register(formData);
      const { token, user } = response.data;
      login(user, token, 'user');
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 p-5">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="mb-7 text-sm text-slate-500">Join us to preserve your family memories</p>

        <form onSubmit={handleSubmit} className="mb-5 space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-800">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <a href="/login" className="font-semibold text-indigo-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
