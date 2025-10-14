
import React, { useState } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function CreateTicket() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    category: 'Software Issue', 
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); 
      const data = { ...form, userId }; 
      const res = await API.post('/tickets', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message || '✅ Ticket submitted');
      setForm({
        title: '',
        description: '',
        priority: 'Low',
        category: 'Software Issue',
      });
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || '❌ Failed to create ticket');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] font-poppins flex items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-6">
        <LogoutButton />
      </div>

      <div className="w-full max-w-3xl bg-white/40 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg p-8 md:p-12 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-blue-900">
          Submit a New Ticket
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-blue-900 font-semibold">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Software Issue">Software Issue</option>
              <option value="Hardware Issue">Hardware Issue</option>
              <option value="Network Issue">Network Issue</option>
              <option value="Access Request">Access Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-blue-900 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ticket title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-blue-900 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the issue"
              required
            />
          </div>

        

          

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition duration-200 shadow-md"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
