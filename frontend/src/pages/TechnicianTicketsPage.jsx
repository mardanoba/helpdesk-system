import React, { useEffect, useState } from 'react';
import API from '../api/api';
import LogoutButton from '../components/LogoutButton';

export default function TechnicianTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState({});
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Failed to load assigned tickets');
    }
  };

  const handleCommentChange = (ticketId, value) => {
    setComments((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleSubmitComment = async (ticketId) => {
    const comment = comments[ticketId];
    if (!comment?.trim()) {
      setMsg('Comment cannot be empty');
      return;
    }

    try {
      const res = await API.post(
        `/tickets/${ticketId}/comment`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || 'Comment added');
      setComments((prev) => ({ ...prev, [ticketId]: '' }));
      fetchTickets();
    } catch (err) {
      console.error(err);
      setMsg('Failed to add comment');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Priority badge color helper
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-400 text-yellow-900';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex justify-center py-10 px-4 font-poppins text-blue-900">
      <div className="max-w-5xl w-full bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Assigned Tickets</h2>
          <LogoutButton />
        </div>

        {msg && (
          <div className="mb-6 p-3 rounded bg-blue-100 text-blue-900 font-medium select-none">
            {msg}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center text-blue-700 italic text-lg py-10 select-none">
            No tickets assigned to you.
          </div>
        ) : (
          <div className="space-y-8">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow-md border border-blue-300 overflow-hidden"
              >
                <div className="bg-blue-100 px-6 py-3 flex justify-between items-center border-b border-blue-300">
                  <h5 className="text-xl font-semibold">{ticket.title}</h5>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityClasses(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                </div>

                <div className="px-6 py-5 text-blue-900">
                  <p className="mb-2">
                    <strong>Status:</strong> {ticket.status}
                  </p>
                  <p className="mb-2">
                    <strong>Created By:</strong> {ticket.user_name}
                  </p>
                  <p className="mb-5 whitespace-pre-wrap">{ticket.description}</p>

                  {ticket.status !== 'RESOLVED' && (
                    <>
                      <label
                        htmlFor={`comment-${ticket.id}`}
                        className="block mb-2 font-semibold"
                      >
                        Your Response
                      </label>
                      <textarea
                        id={`comment-${ticket.id}`}
                        rows={3}
                        placeholder="Write your response here..."
                        value={comments[ticket.id] || ''}
                        onChange={(e) => handleCommentChange(ticket.id, e.target.value)}
                        className="w-full rounded-md border border-blue-300 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-3">
                        <button
                          onClick={() => handleSubmitComment(ticket.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded shadow transition"
                        >
                          Submit Response
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-6 py-3 bg-blue-50 border-t border-blue-300 text-blue-700 text-sm italic">
                  Ticket created at {new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
