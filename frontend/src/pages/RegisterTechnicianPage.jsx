import React, { useState } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function RegisterTechnicianPage() {
  const [form, setForm] = useState({
    name: '',       
    username: '',   
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/register-technician', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      setMsg(res.data.message);
      setForm({ name: '', username: '', email: '', password: '' }); 
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex flex-col items-center justify-center px-4 font-poppins">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-8">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>

        <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">Register Technician</h3>

        {msg && (
          <div className="mb-4 px-4 py-3 rounded bg-blue-100 text-blue-800 shadow relative">
            {msg}
            <button
              onClick={() => setMsg('')}
              className="absolute top-2 right-3 text-blue-700 hover:text-blue-900 font-bold text-xl leading-none"
              aria-label="Close message"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
