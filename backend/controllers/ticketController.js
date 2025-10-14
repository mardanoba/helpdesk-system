const db = require('../models/db');
const sendEmail = require('../utils/mailer');
require('dotenv').config();

// ── Get all tickets (Admin)
exports.getAllTickets = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT t.id, t.title, t.description, t.priority, t.status, t.created_at, t.resolvedAt,
             t.category, u.name AS user_name, t.assigned_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

// ── Create new ticket & notify admin
exports.createTicket = async (req, res) => {
  const { userId, title, description, priority, category } = req.body;

  if (!userId || !title || !description || !priority || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const allowedCategories = [
    'Software Issue',
    'Hardware Issue',
    'Network Issue',
    'Access Request',
    'Other'
  ];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    await db.query(
      'INSERT INTO tickets (user_id, title, category, description, priority, status, created_at) VALUES (?, ?, ?, ?, ?, "OPEN", NOW())',
      [userId, title, category, description, priority]
    );
    console.log('Ticket inserted into database.');

    let adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      const [adminRow] = await db.query('SELECT email FROM users WHERE role = "admin" LIMIT 1');
      if (adminRow.length > 0) {
        adminEmail = adminRow[0].email;
      }
    }

    if (adminEmail) {
      try {
        await sendEmail(
          adminEmail,
          '📩 New Ticket Submitted',
          `<p>A new ticket has been submitted.<br>
          <strong>Title:</strong> ${title}<br>
          <strong>Category:</strong> ${category}<br>
          <strong>Description:</strong> ${description}<br>
          Please log in to the admin dashboard to view and assign.</p>`
        );
      } catch (emailErr) {
        console.error('Failed to send notification email to admin:', emailErr);
      }
    }

    res.status(201).json({ message: 'Ticket submitted and admin notified.' });
  } catch (error) {
    console.error('Ticket creation failed:', error);
    res.status(500).json({ message: 'Server error while creating ticket' });
  }
};

// ── Assign ticket & notify technician
exports.assignTicket = async (req, res) => {
  const ticketId = req.params.ticketId;
  const { technicianId } = req.body;
  if (!technicianId) {
    return res.status(400).json({ message: 'Technician ID is required' });
  }

  try {
    const [tech] = await db.query(
      'SELECT name, email FROM users WHERE id = ? AND role = "technician"',
      [technicianId]
    );
    if (tech.length === 0) {
      return res.status(400).json({ message: 'Invalid technician ID' });
    }
    const technicianName = tech[0].name;
    const technicianEmail = tech[0].email;

    // Update ticket: assigned_to, assigned_name, AND status to 'IN_PROGRESS'
    await db.query(
      'UPDATE tickets SET assigned_to = ?, assigned_name = ?, status = "IN_PROGRESS" WHERE id = ?',
      [technicianId, technicianName, ticketId]
    );

    try {
      await sendEmail(
        technicianEmail,
        '📌 New Ticket Assigned to You',
        `<p>Hello ${technicianName},<br>Your assigned ticket ID is <strong>${ticketId}</strong>.<br>Please log in to the dashboard to view details and respond.</p>`
      );
    } catch (emailErr) {
      console.error('Failed to send notification email to technician:', emailErr);
    }

    res.json({ message: `Ticket assigned to ${technicianName} and marked In Progress` });
  } catch (err) {
    console.error('Error assigning ticket:', err);
    res.status(500).json({ message: 'Server error while assigning ticket' });
  }
};

// ── Technician adds comment & notify user
exports.addComment = async (req, res) => {
  const technicianId = req.user.id;
  const ticketId = req.params.ticketId;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }

  try {
    await db.query(
      'INSERT INTO comments (ticket_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())',
      [ticketId, technicianId, comment]
    );

    // Mark ticket as resolved and set resolvedAt
    await db.query(
      "UPDATE tickets SET status = 'RESOLVED', resolvedAt = NOW() WHERE id = ?",
      [ticketId]
    );

    const [ticketInfo] = await db.query(`
      SELECT u.email, u.name
      FROM users u
      JOIN tickets t ON t.user_id = u.id
      WHERE t.id = ?
    `, [ticketId]);

    if (ticketInfo.length > 0) {
      const userEmail = ticketInfo[0].email;
      const userName = ticketInfo[0].name;

      try {
        await sendEmail(
          userEmail,
          '💬 Your Ticket Has Been Responded',
          `<p>Hello ${userName},<br>Your ticket (ID: ${ticketId}) has a new response:<br><em>${comment}</em><br>Please log in to check the update.</p>`
        );
      } catch (emailErr) {
        console.error('Failed to send notification email to user:', emailErr);
      }
    }

    res.status(201).json({ message: 'Comment added and user notified' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

// ── Other helpers
exports.getComments = async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const [comments] = await db.query(`
      SELECT c.id, c.comment, c.created_at, u.name AS commenter
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
    `, [ticketId]);
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.updatePriority = async (req, res) => {
  const ticketId = req.params.ticketId;
  const { priority } = req.body;
  if (!priority) return res.status(400).json({ message: 'Priority is required' });

  try {
    await db.query('UPDATE tickets SET priority = ? WHERE id = ?', [priority, ticketId]);
    res.json({ message: 'Priority updated successfully' });
  } catch (err) {
    console.error('Error updating priority:', err);
    res.status(500).json({ message: 'Failed to update priority' });
  }
};

exports.getTechnicians = async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name FROM users WHERE role = "technician"');
    res.json(results);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ message: 'Error fetching technicians' });
  }
};

exports.getAssignedTickets = async (req, res) => {
  const userId = req.user.id;
  try {
    const [results] = await db.query(
      'SELECT * FROM tickets WHERE assigned_to = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching assigned tickets:', err);
    res.status(500).json({ message: 'Failed to get assigned tickets' });
  }
};

exports.getTicketReport = async (req, res) => {
  try {
    const [summary] = await db.query(`
      SELECT
        SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS open_tickets,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved_tickets
      FROM tickets
    `);

    const [weekly] = await db.query(`
      SELECT
        YEAR(created_at) AS year,
        WEEK(created_at, 1) AS week,
        COUNT(*) AS ticket_count
      FROM tickets
      GROUP BY year, week
      ORDER BY year DESC, week DESC
      LIMIT 10
    `);

    const [allTickets] = await db.query('SELECT id, title, status, created_at, resolvedAt FROM tickets');

    const formattedTickets = allTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      createdAt: new Date(ticket.created_at).toISOString(),
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt).toISOString() : null
    }));

    res.json({
      summary: summary[0],
      weekly,
      allTickets: formattedTickets
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Failed to get ticket report' });
  }
};
