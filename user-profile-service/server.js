const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json()); // E RËNDËSISHME: për të lexuar req.body si JSON

// ✅ Supabase konfigurimi
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'jwt_secret_key';

// ✅ Middleware për verifikimin e tokenit
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ✅ Regjistrimi i përdoruesit
app.post('/users', async (req, res) => {
  console.log('REQ BODY:', req.body); // për debug

  const { email, password, name } = req.body;

  const missingFields = [];
  if (!email || email.trim() === '') missingFields.push('email');
  if (!password || password.trim() === '') missingFields.push('password');
  if (!name || name.trim() === '') missingFields.push('name');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: {
        message: `Fushat që mungojnë: ${missingFields.join(', ')}`,
        code: 400
      }
    });
  }

  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (checkError) {
    return res.status(500).json({ error: 'Database error', details: checkError.message });
  }

  if (existingUser && existingUser.length > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, name, password: hashedPassword }])
    .select();

  if (error) {
    return res.status(500).json({ error: 'Database insert error', details: error.message });
  }

  res.status(201).json({ message: 'User registered successfully', user: data[0] });
});

// ✅ Autentifikimi
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const missing = [];
  if (!email) missing.push('email');
  if (!password) missing.push('password');

  if (missing.length > 0) {
    return res.status(400).json({
      error: {
        message: `Fushat që mungojnë: ${missing.join(', ')}`,
        code: 400
      }
    });
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) {
    return res.status(500).json({ error: 'Database error', details: error.message });
  }

  if (!users || users.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });

  res.status(200).json({ token, userId: user.id });
});

// ✅ Profili i përdoruesit të loguar
app.get('/users/me', authenticateToken, async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, created_at, last_login')
    .eq('id', req.user.userId)
    .limit(1);

  if (error || !users || users.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(users[0]);
});

// ✅ Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ✅ Startimi i serverit
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
