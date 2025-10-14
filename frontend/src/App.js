
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import UserPage from './pages/UserPage';
import CreateTicket from './pages/CreateTicket'; 
import ViewTickets from './pages/ViewTickets';

import AdminPage from './pages/AdminPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageTicketsPage from './pages/ManageTicketsPage';
import ManageTechniciansPage from './pages/ManageTechniciansPage';
import RegisterTechnicianPage from './pages/RegisterTechnicianPage';
import AssignTicketPage from './pages/AssignTicketPage';

import TechnicianTicketsPage from './pages/TechnicianTicketsPage';
import ReportPage from './pages/ReportPage';
import AboutUs from './pages/AboutUs';
import ForgotPasswordPage from './pages/ForgotPasswordPage';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/user" element={<UserPage />} />
        <Route path="/create-ticket" element={<CreateTicket />} /> {/* ✅ CORRECT */}
        <Route path="/view-tickets" element={<ViewTickets />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/manage-users" element={<ManageUsersPage />} />
        <Route path="/manage-tickets" element={<ManageTicketsPage />} />
        <Route path="/manage-technicians" element={<ManageTechniciansPage />} />
        <Route path="/register-technician" element={<RegisterTechnicianPage />} />
        <Route path="/assign-ticket" element={<AssignTicketPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/technician" element={<TechnicianTicketsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
