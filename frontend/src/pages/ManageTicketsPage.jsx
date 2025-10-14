import React, { useEffect, useState, useMemo } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); 
  const [searchCategory, setSearchCategory] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc'); // dateDesc, dateAsc, titleAsc, titleDesc

  const userId = parseInt(localStorage.getItem('userId'));

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to load tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-bold';
    if (status === 'RESOLVED') return `${base} bg-green-100 text-green-700`;
    if (status === 'IN_PROGRESS') return `${base} bg-yellow-100 text-yellow-700`;
    if (status === 'OPEN') return `${base} bg-red-100 text-red-700`;
    return base;
  };

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    if (activeTab !== 'ALL') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    if (searchCategory.trim() !== '') {
      filtered = filtered.filter(t =>
        t.category.toLowerCase() === searchCategory.toLowerCase()
      );
    }

    switch (sortBy) {
      case 'dateAsc':
        filtered = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'dateDesc':
        filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'titleAsc':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [tickets, activeTab, searchCategory, sortBy]);

  const categories = [...new Set(tickets.map(t => t.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] py-10 px-4 font-poppins">
      <div className="max-w-7xl mx-auto bg-white/40 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900">All Tickets</h2>
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

        {/* TABS */}
        <div className="mb-4 flex space-x-4">
          {statuses.map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded font-semibold ${
                activeTab === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
              }`}
              onClick={() => setActiveTab(status)}
            >
              {status === 'ALL' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* CATEGORY FILTER & SORT */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded w-48"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded w-48"
          >
            <option value="dateDesc">Sort by Date (Newest)</option>
            <option value="dateAsc">Sort by Date (Oldest)</option>
            <option value="titleAsc">Sort by Title (A-Z)</option>
            <option value="titleDesc">Sort by Title (Z-A)</option>
          </select>
        </div>

        {/* TICKETS TABLE */}
        {filteredTickets.length === 0 ? (
          <p className="text-center text-blue-900 font-medium">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto rounded-md shadow-sm">
            <table className="w-full border border-blue-300 rounded text-left">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="px-6 py-3 border-b">Title</th>
                  <th className="px-6 py-3 border-b">Description</th>
                  <th className="px-6 py-3 border-b">Category</th>
                  <th className="px-6 py-3 border-b">Priority</th>
                  <th className="px-6 py-3 border-b">Status</th>
                  <th className="px-6 py-3 border-b">User</th>
                  <th className="px-6 py-3 border-b">Created At</th>
                  <th className="px-6 py-3 border-b">Resolved At</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 border-b">{ticket.title}</td>
                    <td className="px-6 py-4 border-b">{ticket.description}</td>
                    <td className="px-6 py-4 border-b">{ticket.category}</td>
                    <td className="px-6 py-4 border-b">{ticket.priority}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">{ticket.user_name}</td>
                    <td className="px-6 py-4 border-b">
                      {new Date(ticket.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {ticket.resolvedAt
                        ? new Date(ticket.resolvedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
