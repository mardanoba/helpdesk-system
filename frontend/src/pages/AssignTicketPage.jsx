import React, { useEffect, useState } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function AssignTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to load tickets');
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await API.get('/technicians', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(res.data);
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to load technicians');
    }
  };

  const handleAssign = async (ticketId, technicianId) => {
    if (!technicianId) {
      setMsg('⚠️ Please select a technician');
      return;
    }

    try {
      const res = await API.put(
        `/tickets/${ticketId}/assign`,
        { technicianId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || '✅ Ticket assigned successfully');
      fetchTickets();
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to assign ticket');
    }
  };

  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      const res = await API.put(
        `/tickets/${ticketId}/priority`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || '✅ Priority updated successfully');
      fetchTickets();
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to update priority');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] font-poppins px-4 py-10 flex items-center justify-center">
      
      <div className="absolute top-4 right-6">
        <LogoutButton />
      </div>

      <div className="w-full max-w-7xl bg-white/40 backdrop-blur-md border border-blue-200 rounded-xl shadow-lg p-6 md:p-10">
        
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
          Assign Tickets & Set Priority
        </h1>

        {msg && (
          <div className="mb-6 text-center px-4 py-3 rounded bg-blue-100 text-blue-800 shadow">
            {msg}
            <button
              className="float-right text-blue-700 hover:text-blue-900"
              onClick={() => setMsg('')}
            >
              &times;
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-blue-800 bg-white/60">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Set Priority</th>
                <th className="px-4 py-3">Assign Technician</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map(ticket => (
                  <tr key={ticket.id} className="border-b border-blue-100 hover:bg-blue-50">
                    <td className="px-4 py-3">{ticket.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold 
                        ${ticket.status === 'Open' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ticket.assigned_name || <span className="text-gray-500">Not Assigned</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full p-2 border border-blue-300 rounded-md text-sm"
                        defaultValue={ticket.priority}
                        onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full p-2 border border-blue-300 rounded-md text-sm"
                        onChange={(e) => handleAssign(ticket.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Technician</option>
                        {technicians.map(tech => (
                          <option key={tech.id} value={tech.id}>{tech.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-600 py-6">
                    No tickets available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
