const express = require('express');
const { signup, verifyEmail, login, resendVerification, updateProfile, changePassword } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.patch('/profile', authenticateToken, updateProfile);
router.patch('/password', authenticateToken, changePassword);

module.exports = router;