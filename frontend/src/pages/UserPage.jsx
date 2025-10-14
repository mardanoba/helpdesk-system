import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function UserPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex justify-center items-center px-4 py-10 font-poppins text-blue-900">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold select-none">Welcome, User!</h1>
          <LogoutButton />
        </div>

        <div className="flex flex-col space-y-6">
          <button
            onClick={() => navigate("/create-ticket")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
          >
            Create Ticket
          </button>

          <button
            onClick={() => navigate("/view-tickets")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
          >
            View Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
