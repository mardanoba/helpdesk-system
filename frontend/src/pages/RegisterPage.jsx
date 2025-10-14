import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [form, setForm] = useState({ fullname: '', username: '', password: '', code: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await API.post('/auth/request-verification-code', { email });
      setToken(res.data.token);
      setMsg('Verification code sent to your email.');
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send verification code.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const payload = {
        name: form.fullname,
        username: form.username,
        email,
        password: form.password,
        code: form.code,
        token,
      };
      const res = await API.post('/auth/register-with-code', payload);
      setMsg(res.data.message || 'Registration successful!');
      setTimeout(() => nav('/login'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex flex-col items-center justify-center px-4 font-poppins">
      <div className="bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg max-w-md w-full p-8">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">Register</h2>

        {msg && (
          <div className="mb-4 px-4 py-3 rounded bg-green-100 text-green-800 shadow relative">
            {msg}
            <button
              onClick={() => setMsg('')}
              className="absolute top-2 right-3 text-green-700 hover:text-green-900 font-bold text-xl leading-none"
              aria-label="Close message"
            >
              &times;
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded bg-red-100 text-red-800 shadow relative">
            {error}
            <button
              onClick={() => setError('')}
              className="absolute top-2 right-3 text-red-700 hover:text-red-900 font-bold text-xl leading-none"
              aria-label="Close error"
            >
              &times;
            </button>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="email"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow transition"
            >
              Send Verification Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="name"
            />
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="username"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="new-password"
            />
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Verification Code"
              className="border border-blue-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow transition"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
