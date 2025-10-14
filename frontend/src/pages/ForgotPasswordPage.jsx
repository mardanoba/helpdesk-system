import React, { useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');

  const requestResetCode = async () => {
    setMsg('');
    try {
      const res = await API.post('/auth/request-reset-code', { email });
      setToken(res.data.token);
      setStep(2);
      setMsg('✅ Reset code sent to your email.');
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Failed to send reset code.');
    }
  };

  const submitNewPassword = async () => {
    setMsg('');
    try {
      await API.post('/auth/reset-password', { email, code, token, newPassword });
      setMsg('✅ Password reset successful! You can now login.');
      setStep(3);
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex items-center justify-center px-4 py-10 font-poppins">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-900">Forgot Password</h2>

        {msg && (
          <div className="text-center px-4 py-3 rounded bg-blue-100 text-blue-800 shadow">
            {msg}
            <button
              className="float-right text-blue-700 hover:text-blue-900"
              onClick={() => setMsg('')}
            >
              &times;
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <label className="block mb-1 text-blue-900 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              onClick={requestResetCode}
              className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition duration-200 shadow"
              disabled={!email}
            >
              Send Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-1 text-blue-900 font-semibold">Reset Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter the reset code"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label className="block mt-4 mb-1 text-blue-900 font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              onClick={submitNewPassword}
              className="w-full py-3 mt-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition duration-200 shadow"
              disabled={!code || !newPassword}
            >
              Reset Password
            </button>
          </>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <p className="text-blue-900 font-medium">
              🎉 Your password has been reset successfully.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-200 shadow"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
