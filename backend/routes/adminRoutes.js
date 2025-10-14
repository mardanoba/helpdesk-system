// backend/routes/adminRoutes.js (or similar)
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Get all users with role 'user'
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email FROM users WHERE role = ?', ['user']);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by id
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM users WHERE id = ? AND role = ?', [userId, 'user']);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all technicians
router.get('/technicians', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [technicians] = await db.query(
      'SELECT id, name, email FROM users WHERE role = ?', 
      ['technician']
    );
    res.json(technicians);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete technician by id
router.delete('/technicians/:id', authenticateToken, isAdmin, async (req, res) => {
  const techId = req.params.id;
  try {
    await db.query(
      'DELETE FROM users WHERE id = ? AND role = ?', 
      [techId, 'technician']
    );
    res.json({ message: 'Technician deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
