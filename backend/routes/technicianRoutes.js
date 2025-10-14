const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

//Route to register a new technician (Admin only)
router.post('/register-technician', authenticateToken, isAdmin, async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required (name, username, email, password)' });
  }

  try {
    // Check if email or username already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB with username
    await db.query(
      'INSERT INTO users (name, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, username, email, hashedPassword, 'technician']
    );

    res.status(201).json({ message: 'Technician registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/ticket/:id/resolve', authenticateToken, async (req, res) => {
  const technicianId = req.user.id;
  const ticketId = req.params.id;

  try {
    const [ticketRows] = await db.query(
      'SELECT assigned_to FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticketRows[0].assigned_to !== technicianId) {
      return res.status(403).json({ message: 'Not authorized to resolve this ticket' });
    }

    await db.query(
      'UPDATE tickets SET status = ?, resolvedAt = NOW() WHERE id = ?',
      ['RESOLVED', ticketId]
    );

    res.json({ message: 'Ticket marked as resolved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
