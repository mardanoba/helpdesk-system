require('dotenv').config();
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"HelpDesk System" <${EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email address' });

  try {
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const token = jwt.sign({ email, hashedCode }, JWT_SECRET, { expiresIn: '15m' });

    await sendEmail(
      email,
      'Your HelpDesk Registration Verification Code',
      `Your verification code is: ${code}. It expires in 15 minutes.`
    );

    return res.json({ message: 'Verification code sent', token });
  } catch (err) {
    console.error('sendVerificationCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerUserWithCode = async (req, res) => {
  const { name, username, email, password, code, token } = req.body;

  if (!name || !username || !email || !password || !code || !token) {
    return res.status(400).json({ message: 'All fields including code and token are required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.email !== email) {
      return res.status(400).json({ message: 'Email does not match token' });
    }

    const isCodeValid = await bcrypt.compare(code, payload.hashedCode);
    if (!isCodeValid) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if email or username already exists
    const [emailRows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (emailRows.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const [usernameRows] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (usernameRows.length) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('registerUserWithCode error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification token expired. Please request a new code.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required' });
  }

  try {
    // Query by email or username
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      id: user.id,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD PART - send reset code by email
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email address' });

  try {
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const token = jwt.sign({ email, hashedCode }, JWT_SECRET, { expiresIn: '15m' });

    await sendEmail(
      email,
      'Your HelpDesk Password Reset Code',
      `Your password reset code is: ${code}. It expires in 15 minutes.`
    );

    res.json({ message: 'Reset code sent', token });
  } catch (err) {
    console.error('sendResetCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD - reset password with code + token
exports.resetPasswordWithCode = async (req, res) => {
  const { email, code, token, newPassword } = req.body;

  if (!email || !code || !token || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.email !== email) {
      return res.status(400).json({ message: 'Email does not match token' });
    }

    const isCodeValid = await bcrypt.compare(code, payload.hashedCode);
    if (!isCodeValid) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPasswordWithCode error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token expired. Please request a new code.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
