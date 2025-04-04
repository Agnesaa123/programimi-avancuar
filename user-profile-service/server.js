// user-profile-service/server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env variable in production

// Middleware
app.use(express.json());  // Ensure that we can parse JSON data in requests

// In-memory user storage (replace with database in production)
const users = [];

// ===== HELPER FUNCTIONS =====

// Find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  return password.length >= 8; // Add more rules as needed
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// ===== ROUTES =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-profile-service' });
});

// POST /users - Create a new user
app.post('/users', async (req, res) => {
  const { email, password, name, address } = req.body;

  // Validate inputs
  if (!email || !password || !name || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password strength
  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Check if email is already used
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    address,
    registrationDate: new Date().toISOString(),
    lastLogin: null,
  };

  // Store user
  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    address: newUser.address,
    registrationDate: newUser.registrationDate,
  });
});

// POST /auth/login - Authenticate user and generate JWT
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user by email
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

  res.status(200).json({
    token,
    userId: user.id,
  });
});

// GET /users/me - Get current user profile (protected)
app.get('/users/me', authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    registrationDate: user.registrationDate,
    lastLogin: user.lastLogin,
  });
});

// GET /users/:id - Get user by ID (protected)
app.get('/users/:id', authenticateToken, (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    registrationDate: user.registrationDate,
    lastLogin: user.lastLogin,
  });
});

// PUT /users/:id - Update user details (protected)
app.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  // Find user by ID
  const user = findUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Ensure the current user is the one being updated
  if (user.id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to update this profile' });
  }

  // Update user details
  user.name = name || user.name;
  user.address = address || user.address;

  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    registrationDate: user.registrationDate,
    lastLogin: user.lastLogin,
  });
});

// DELETE /users/:id - Delete user (protected)
app.delete('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Find user by ID
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Ensure the current user is the one being deleted
  if (users[userIndex].id !== req.user.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this profile' });
  }

  // Delete the user
  users.splice(userIndex, 1);

  res.status(200).json({ message: 'User deleted successfully' });
});
// GET / - Ruga kryesore (home route)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the User Profile Service!' });
  });
  
// Start the server
app.listen(PORT, () => {
    console.log(`User Profile Service running on port ${PORT}`);
  });
  