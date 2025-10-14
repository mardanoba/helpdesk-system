const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');

router.post('/register-with-code', auth.registerUserWithCode);
router.post('/login', auth.login);
router.post('/request-verification-code', auth.sendVerificationCode);

// forgot password routes
router.post('/request-reset-code', auth.sendResetCode);
router.post('/reset-password', auth.resetPasswordWithCode);

module.exports = router;
