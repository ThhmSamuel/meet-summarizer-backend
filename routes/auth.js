// routes/auth.js
const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.get('/logout', logout);

module.exports = router;