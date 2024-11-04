const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));
router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token from cookies
    res.status(200).json({ message: 'Logged out successfully' }); // Optionally return a success message
});

module.exports = router;
