import React, { useEffect, useState } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function ViewMyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [responses, setResponses] = useState({});
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const res = await API.get('/mytickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Failed to load tickets');
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const res = await API.delete(`/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message || 'Ticket deleted');
      fetchTickets();
    } catch (err) {
      console.error('Delete error response:', err.response?.data, err.message);
      if (err.response?.data?.message) {
        setMsg(`❌ ${err.response.data.message}`);
      } else {
        setMsg('❌ Could not delete ticket (see console)');
      }
    }
  };

  const fetchComments = async (ticketId) => {
    try {
      const res = await API.get(`/tickets/${ticketId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponses((prev) => ({ ...prev, [ticketId]: res.data }));
    } catch (err) {
      console.error('Failed to load comments for ticket', ticketId, err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    tickets.forEach((ticket) => fetchComments(ticket.id));
  }, [tickets]);

  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-yellow-400 text-yellow-900';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex justify-center px-4 py-10 font-poppins text-blue-900">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold select-none">My Tickets</h2>
          <LogoutButton />
        </div>

        {msg && (
          <div className="mb-6 p-3 rounded bg-blue-100 text-blue-900 font-medium select-none">
            {msg}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center italic text-blue-700 py-10 select-none">
            You have no tickets.
          </div>
        ) : (
          <div className="space-y-8">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md border border-blue-300">
                <div className="bg-blue-100 px-6 py-3 flex justify-between items-center border-b border-blue-300">
                  <h5 className="text-xl font-semibold">{ticket.title}</h5>
                  {ticket.priority && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none ${getPriorityClasses(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  )}
                </div>

                <div className="px-6 py-5 text-blue-900">
                  <p className="mb-2">
                    <strong>Status:</strong> {ticket.status}
                  </p>
                  <p className="mb-2">
                    <strong>Category:</strong> {ticket.category}
                  </p>
                  <p className="mb-2">
                    <strong>Created at:</strong> {new Date(ticket.created_at).toLocaleString()}
                  </p>
                  <p className="mb-3 whitespace-pre-wrap">{ticket.description}</p>

                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="mb-5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded shadow transition"
                  >
                    Delete Ticket
                  </button>

                  <h6 className="mb-3 font-semibold">Responses:</h6>
                  {(!responses[ticket.id] || responses[ticket.id].length === 0) ? (
                    <p className="text-gray-600 italic select-none">No responses yet.</p>
                  ) : (
                    <ul className="space-y-3 max-h-48 overflow-y-auto border border-blue-200 rounded p-3 bg-blue-50">
                      {responses[ticket.id].map((resp) => (
                        <li key={resp.id} className="bg-white rounded shadow p-3">
                          <div className="flex justify-between mb-1 text-sm text-blue-900 font-semibold">
                            <span>{resp.technician_name || resp.commenter}</span>
                            <span className="text-xs text-blue-600 font-normal select-none">
                              {new Date(resp.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{resp.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
