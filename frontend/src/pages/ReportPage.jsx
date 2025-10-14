import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LogoutButton from '../components/LogoutButton';

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the ticket report from backend
  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tickets/report', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Format a date string nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Generate PDF for full tickets report
  const generateFullReportPDF = () => {
    if (!report || !report.allTickets) return;

    const doc = new jsPDF();
    doc.text('Full Ticket Report', 14, 14);

    const rows = report.allTickets.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.status,
      formatDate(ticket.createdAt),
      ticket.resolvedAt ? formatDate(ticket.resolvedAt) : 'Not Resolved',
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Title', 'Status', 'Created At', 'Resolved At']],
      body: rows,
    });

    doc.save('Full_Ticket_Report.pdf');
  };

  // Generate PDF report for tickets in a specific week
  const generateWeekPDF = (week, weekTickets) => {
    const doc = new jsPDF();
    doc.text(`${week} Ticket Report`, 14, 14);

    const rows = weekTickets.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.status,
      formatDate(ticket.createdAt),
      ticket.resolvedAt ? formatDate(ticket.resolvedAt) : 'Not Resolved',
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Title', 'Status', 'Created At', 'Resolved At']],
      body: rows,
    });

    doc.save(`${week.replace(/\s+/g, '_')}_Ticket_Report.pdf`);
  };

  // Group tickets by week string key from allTickets
  const groupTicketsByWeek = () => {
    if (!report || !report.allTickets) return {};

    return report.allTickets.reduce((acc, ticket) => {
      let weekKey = 'Unknown Week';
      if (ticket.createdAt) {
        const date = new Date(ticket.createdAt);
        const year = date.getFullYear();

        // calculate ISO week number
        const tempDate = new Date(date.getTime());
        tempDate.setHours(0, 0, 0, 0);
        tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
        const yearStart = new Date(tempDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);

        weekKey = `Week ${weekNumber} - ${year}`;
      }

      if (!acc[weekKey]) acc[weekKey] = [];
      acc[weekKey].push(ticket);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex items-center justify-center font-poppins text-blue-900">
        <p className="text-lg font-semibold">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex items-center justify-center font-poppins text-red-600">
        <p className="text-lg font-semibold">Failed to load report data.</p>
      </div>
    );
  }

  const ticketsByWeek = groupTicketsByWeek();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] flex justify-center py-10 px-4 font-poppins">
      <div className="max-w-7xl w-full bg-white/70 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg p-8 text-blue-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ticket Report</h1>
          <LogoutButton />
        </div>

        {/* Summary Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 border-b border-blue-300 pb-1">Summary</h2>
          <ul className="list-disc list-inside space-y-1 text-lg">
            <li>Open Tickets: <span className="font-medium">{report.summary.open_tickets}</span></li>
            <li>In Progress Tickets: <span className="font-medium">{report.summary.in_progress_tickets}</span></li>
            <li>Resolved Tickets: <span className="font-medium">{report.summary.resolved_tickets}</span></li>
          </ul>
        </section>

        {/* Weekly Report Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b border-blue-300 pb-1">Weekly Report (Last 10 Weeks)</h2>

          <table className="w-full border border-blue-300 rounded-md overflow-hidden mb-6">
            <thead className="bg-blue-100 text-blue-900 font-semibold">
              <tr>
                <th className="border border-blue-300 px-4 py-2 text-left">Year</th>
                <th className="border border-blue-300 px-4 py-2 text-left">Week</th>
                <th className="border border-blue-300 px-4 py-2 text-left">Tickets Count</th>
                <th className="border border-blue-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {report.weekly.map((weekData) => {
                const weekLabel = `Week ${weekData.week} - ${weekData.year}`;
                return (
                  <tr
                    key={`${weekData.year}-${weekData.week}`}
                    className="even:bg-white odd:bg-blue-50"
                  >
                    <td className="border border-blue-300 px-4 py-2">{weekData.year}</td>
                    <td className="border border-blue-300 px-4 py-2">{weekData.week}</td>
                    <td className="border border-blue-300 px-4 py-2">{weekData.ticket_count}</td>
                    <td className="border border-blue-300 px-4 py-2">
                      <button
                        onClick={() => generateWeekPDF(weekLabel, ticketsByWeek[weekLabel] || [])}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded shadow transition"
                      >
                        Generate PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Detailed weekly tickets */}
          {report.weekly.map((weekData) => {
            const weekLabel = `Week ${weekData.week} - ${weekData.year}`;
            const tickets = ticketsByWeek[weekLabel] || [];
            return (
              <div key={`table-${weekLabel}`} className="mb-10">
                <h3 className="text-xl font-semibold mb-3">{weekLabel} Tickets ({tickets.length})</h3>
                {tickets.length === 0 ? (
                  <p className="italic text-gray-600">No tickets found for this week.</p>
                ) : (
                  <table className="w-full border border-blue-300 rounded-md overflow-hidden">
                    <thead className="bg-blue-100 text-blue-900 font-semibold">
                      <tr>
                        <th className="border border-blue-300 px-3 py-2 text-left">ID</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">Title</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">Status</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">Created At</th>
                        <th className="border border-blue-300 px-3 py-2 text-left">Resolved At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="even:bg-white odd:bg-blue-50"
                        >
                          <td className="border border-blue-300 px-3 py-1">{ticket.id}</td>
                          <td className="border border-blue-300 px-3 py-1">{ticket.title}</td>
                          <td className="border border-blue-300 px-3 py-1">{ticket.status}</td>
                          <td className="border border-blue-300 px-3 py-1">{formatDate(ticket.createdAt)}</td>
                          <td className="border border-blue-300 px-3 py-1">{ticket.resolvedAt ? formatDate(ticket.resolvedAt) : 'Not Resolved'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </section>

        {/* Full Tickets Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b border-blue-300 pb-1">All Tickets</h2>
          <button
            onClick={generateFullReportPDF}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded shadow transition"
          >
            Generate Full Report PDF
          </button>
          <table className="w-full border border-blue-300 rounded-md overflow-hidden">
            <thead className="bg-blue-100 text-blue-900 font-semibold">
              <tr>
                <th className="border border-blue-300 px-3 py-2 text-left">ID</th>
                <th className="border border-blue-300 px-3 py-2 text-left">Title</th>
                <th className="border border-blue-300 px-3 py-2 text-left">Status</th>
                <th className="border border-blue-300 px-3 py-2 text-left">Created At</th>
                <th className="border border-blue-300 px-3 py-2 text-left">Resolved At</th>
              </tr>
            </thead>
            <tbody>
              {report.allTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="even:bg-white odd:bg-blue-50"
                >
                  <td className="border border-blue-300 px-3 py-1">{ticket.id}</td>
                  <td className="border border-blue-300 px-3 py-1">{ticket.title}</td>
                  <td className="border border-blue-300 px-3 py-1">{ticket.status}</td>
                  <td className="border border-blue-300 px-3 py-1">{formatDate(ticket.createdAt)}</td>
                  <td className="border border-blue-300 px-3 py-1">{ticket.resolvedAt ? formatDate(ticket.resolvedAt) : 'Not Resolved'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ReportPage;
