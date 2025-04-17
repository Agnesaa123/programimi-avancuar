const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
};

// Create new user
const createUser = async ({ email, password, name, address }) => {
  if (!email || !password || !name || !address) throw new Error('Missing required fields');

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      address,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    address: data.address,
    registrationDate: data.registration_date,
  };
};

// Get user by ID
const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

// Update user
const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Get current user (same as getUserById)
const getCurrentUser = getUserById;

// Authenticate user
const authenticateUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !user) return null;

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
