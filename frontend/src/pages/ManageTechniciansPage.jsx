import React, { useEffect, useState, useMemo } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function ManageTechnicianPage() {
  const [technicians, setTechnicians] = useState([]);
  const [msg, setMsg] = useState('');
  const [searchName, setSearchName] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc'); // nameAsc, nameDesc, emailAsc, emailDesc

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/admin/technicians', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(res.data);
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to fetch technicians');
    }
  };

  const deleteTechnician = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/admin/technicians/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('✅ Technician deleted successfully');
      fetchTechnicians();
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to delete technician');
    }
  };

  // Filter and sort technicians
  const filteredTechnicians = useMemo(() => {
    let filtered = technicians;

    if (searchName.trim() !== '') {
      filtered = filtered.filter((tech) =>
        tech.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'nameAsc':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'emailAsc':
        filtered = filtered.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'emailDesc':
        filtered = filtered.sort((a, b) => b.email.localeCompare(a.email));
        break;
      default:
        break;
    }

    return filtered;
  }, [technicians, searchName, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex flex-col items-center justify-center px-4 py-10 font-poppins">
      <div className="absolute top-4 right-6">
        <LogoutButton />
      </div>

      <div className="w-full max-w-5xl bg-white/40 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Manage Technicians
        </h2>

        {msg && (
          <div className="mb-6 px-4 py-3 rounded bg-blue-100 text-blue-800 shadow text-center font-medium">
            {msg}
            <button
              className="float-right text-blue-700 hover:text-blue-900"
              onClick={() => setMsg('')}
            >
              &times;
            </button>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded w-64"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded w-48"
          >
            <option value="nameAsc">Sort by Name (A-Z)</option>
            <option value="nameDesc">Sort by Name (Z-A)</option>
            <option value="emailAsc">Sort by Email (A-Z)</option>
            <option value="emailDesc">Sort by Email (Z-A)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-300 rounded shadow text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-blue-800">
                    No technicians found
                  </td>
                </tr>
              ) : (
                filteredTechnicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 border-b">{tech.name}</td>
                    <td className="px-6 py-4 border-b">{tech.email}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm font-semibold transition"
                        onClick={() => deleteTechnician(tech.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
