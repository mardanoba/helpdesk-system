const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getAssignedTickets,
  addComment,
  getAllTickets,
  assignTicket,
  getTechnicians,
  getComments,
  getTicketReport,
  updatePriority
} = require('../controllers/ticketController');

const db = require('../models/db');
const sendEmail = require('../utils/mailer');
require('dotenv').config();

//  Ticket Report for Admin
router.get('/tickets/report', authenticateToken, getTicketReport);

//  Get All Tickets (Admin) 
router.get('/tickets', authenticateToken, getAllTickets);

//  Get Assigned Tickets (Technician) 
router.get('/tickets/assigned', authenticateToken, getAssignedTickets);

// Assign Technician to Ticket
router.put('/tickets/:ticketId/assign', authenticateToken, assignTicket);

// Update Ticket Priority
router.put('/tickets/:ticketId/priority', authenticateToken, updatePriority);

//Get All Technicians
router.get('/technicians', authenticateToken, getTechnicians);

// Get Comments for a Ticket 
router.get('/tickets/:ticketId/comments', authenticateToken, getComments);

// Add Comment to a Ticket
router.post('/tickets/:ticketId/comment', authenticateToken, addComment);

// Create a New Ticket (User)
router.post('/tickets', authenticateToken, async (req, res) => {
  const { title, description, priority, category } = req.body;
  const userId = req.user.id;

  if (!title || !description || !priority || !category) {
    return res.status(400).json({ message: 'Please provide title, description, priority, and category' });
  }

  try {
    const query = `
      INSERT INTO tickets (user_id, title, description, priority, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'OPEN', NOW())
    `;
    await db.query(query, [userId, title, description, priority, category]);

    await sendEmail(
      'hermelayeshanewella@gmail.com',
      `📩 New Ticket Created: ${title}`,
      `<p>A new ticket has been created by user ID ${userId}.</p>
       <p><strong>Title:</strong> ${title}</p>
       <p><strong>Description:</strong> ${description}</p>
       <p><strong>Priority:</strong> ${priority}</p>
       <p><strong>Category:</strong> ${category}</p>`
    );

    res.status(201).json({ message: 'Ticket created successfully' });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Get Tickets Created by the Logged-In User 
router.get('/mytickets', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [tickets] = await db.query(`
      SELECT id, title, description, priority, category, status, created_at
      FROM tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching user tickets:', err);
    res.status(500).json({ message: 'Failed to fetch user tickets' });
  }
});

//  Delete Ticket (Only by Owner)
router.delete('/tickets/:ticketId', authenticateToken, async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user.id;
  console.log(`[DELETE] Request from user ${userId} to delete ticket ${ticketId}`);

  try {
    const [tickets] = await db.query('SELECT user_id FROM tickets WHERE id = ?', [ticketId]);
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (tickets[0].user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this ticket' });
    }

    const [result] = await db.query('DELETE FROM tickets WHERE id = ?', [ticketId]);
    console.log(`[DELETE] Ticket ${ticketId} deleted. Result:`, result);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({ message: 'Server error while deleting ticket' });
  }
});

module.exports = router;
