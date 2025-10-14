import React, { useEffect, useState, useMemo } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const [searchName, setSearchName] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc'); // options: nameAsc, nameDesc, emailAsc, emailDesc

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message);
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filter & sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchName.trim() !== '') {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
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
  }, [users, searchName, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] py-10 px-4 font-poppins">
      <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900">Manage Users</h2>
          <LogoutButton />
        </div>

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

        {/* Search and Sort Controls */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
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

        <div className="overflow-x-auto rounded-md shadow-sm">
          <table className="w-full border border-blue-300 rounded text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-blue-900 font-medium">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b">{user.name}</td>
                    <td className="px-6 py-4 border-b">{user.email}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        className="inline-block px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm font-semibold transition"
                        onClick={() => deleteUser(user.id)}
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
