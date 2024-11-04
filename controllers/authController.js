// authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userRole = role || 'user';
    const user = await User.create({ username, email, password: hashedPassword, role: userRole });
    res.redirect('/auth/login');
};

// authController.js

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set the token as a cookie
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set secure to true in production

  // Return user info without the token
  res.json({
      success: true,
      user: {
          id: user.id,
          role: user.role,
          email: user.email
      }
  });
};
