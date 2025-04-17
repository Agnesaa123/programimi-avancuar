const { authenticateUser } = require('../services/userService');

// Authenticate user and return a token
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);
    if (!token) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginController,
};
