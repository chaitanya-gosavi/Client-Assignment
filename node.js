require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// GET /services
app.get('/services', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /news
app.get('/news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /register
app.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, phone, password) VALUES (?, ?, ?)', [name, phone, hashed]);
    res.json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Phone already registered' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /contact
app.post('/contact', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    await pool.query('INSERT INTO contacts (name, message) VALUES (?, ?)', [name, message]);
    res.json({ message: 'Contact submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /bookings (user's bookings)
app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT b.id, p.name, p.price, b.quantity, b.booked_at FROM bookings b JOIN products p ON b.product_id = p.id WHERE b.user_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /bookings (add booking)
app.post('/bookings', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'Missing fields' });
  try {
    await pool.query('INSERT INTO bookings (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity]);
    res.json({ message: 'Booking added' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});