const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAdmin } = require('../middleware/auth');

router.get('/dashboard', ensureAdmin, adminController.getDashboard);
router.get('/users', ensureAdmin, adminController.listUsers);
router.post('/users/:id/update', ensureAdmin, adminController.updateUser);
router.post('/users/:id/delete', ensureAdmin, adminController.deleteUser);

module.exports = router;
