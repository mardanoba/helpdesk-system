
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('role', res.data.role);
      setMsg(res.data.message);

      if (res.data.role === 'user') {
        nav('/user');
      } else if (res.data.role === 'technician') {
        nav('/technician');
      } else if (res.data.role === 'admin') {
        nav('/admin');
      } else {
        setMsg('Unknown role');
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] font-poppins flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Optional logout button */}
      <div className="absolute top-4 right-6 z-10">
        <LogoutButton />
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-lg shadow-xl w-full max-w-md px-8 py-10 space-y-6 text-gray-800">
        <h2 className="text-3xl font-extrabold text-center text-blue-900 flex items-center justify-center gap-2">
          <FaSignInAlt className="text-blue-700" /> Login
        </h2>

        {msg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="w-full px-4 py-2 border border-blue-300 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-blue-300 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-700 hover:text-blue-900 transition"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
