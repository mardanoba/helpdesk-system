require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');

const authRoutes = require('./routes/authRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const db = require('./models/db');

const app = express();

// ✅ i18n Configuration
i18n.configure({
  locales: ['en', 'am'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'lang',
  autoReload: true,
  syncFiles: true,
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(i18n.init);

// ✅ Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Language switch handler via query (?lang=am)
app.use((req, res, next) => {
  const lang = req.query.lang;
  if (lang) {
    res.cookie('lang', lang);
    req.setLocale(lang);
  }
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);         // Handles login, code request, register with code
app.use('/api', technicianRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', ticketRoutes);

// ✅ Test index page (translated)
app.get('/', (req, res) => {
  res.render('index', { locale: req.getLocale() });
});

// ✅ MySQL Connection Test
db.getConnection()
  .then(conn => {
    console.log('✅ Database connected!');
    conn.release();
  })
  .catch(err => console.error('❌ DB connection failed:', err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
