const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
};

// Create a new user
const createUser = async (userData) => {
  const { email, password, name, address } = userData;
  
  if (!email || !password || !name || !address) throw new Error('Missing required fields');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, password: hashedPassword, name, address, registrationDate: new Date().toISOString() };
  
  users.push(user);
  return { id: user.id, email: user.email, name: user.name, address: user.address, registrationDate: user.registrationDate };
};

// Get user by ID
const getUserById = (id) => {
  return users.find(user => user.id === id);
};

// Update user
const updateUser = (id, userData) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex] = { ...users[userIndex], ...userData };
  return users[userIndex];
};

// Get current user
const getCurrentUser = (id) => {
  return users.find(user => user.id === id);
};

// Authenticate user
const authenticateUser = async (email, password) => {
  const user = users.find(user => user.email === email);
  
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) return null;
  
  return generateToken(user);
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  getCurrentUser,
  authenticateUser,
};