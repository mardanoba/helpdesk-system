
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function AdminPage() {
  const navigate = useNavigate();

  const adminOptions = [
    { label: 'Manage Users', path: '/manage-users' },
    { label: 'Manage Tickets', path: '/manage-tickets' },
    { label: 'Manage Technicians', path: '/manage-technicians' },
    { label: 'Register Technician', path: '/register-technician' },
    { label: 'Assign Ticket & Set Priority', path: '/assign-ticket' },
    { label: 'Reports & Insights', path: '/report' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] font-poppins flex items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* Logout Button */}
      <div className="absolute top-4 right-6 z-10">
        <LogoutButton />
      </div>

      {/* Admin Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white/40 backdrop-blur-md border border-blue-200 rounded-xl shadow-xl px-10 py-12 space-y-10 text-gray-800">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-900">
          Admin Dashboard
        </h1>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-300"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
