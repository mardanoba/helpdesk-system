
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogoutButton.css';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');  // Redirect to homepage after logout
  };

  return (
    <button className="logout-btn" onClick={handleLogout} title="Logout">
      <span className="logout-icon">⏻</span> <span className="logout-text">Logout</span>
    </button>
  );
}
