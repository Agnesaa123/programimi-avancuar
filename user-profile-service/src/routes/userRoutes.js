const express = require('express');
const { createUserController, getUserByIdController, updateUserController, getCurrentUserController } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for users
router.post('/users', createUserController); // Create user
router.get('/users/:id', authenticateToken, getUserByIdController); // Get user by ID
router.put('/users/:id', authenticateToken, updateUserController); // Update user
router.get('/users/me', authenticateToken, getCurrentUserController); // Get current user profile

module.exports = router;