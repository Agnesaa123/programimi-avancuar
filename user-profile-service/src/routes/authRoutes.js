const express = require('express');
const { loginController } = require('../controllers/authController');

const router = express.Router();

// Route for login
router.post('/auth/login', loginController);

module.exports = router;