const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { authenticateToken,authenticateUser } = require('./middleware/auth'); 
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes'); 



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(cookieParser());

// Middleware to authenticate token and attach user info

// Routes
app.use('/auth', authRoutes);
app.use('/', authenticateUser,authenticateToken, courseRoutes);
app.get('/',authenticateUser,authenticateToken ,(req, res) => {
    res.render('home'); // Render the index.ejs file
});
app.use('/admin',authenticateUser,authenticateToken, adminRoutes);
app.use('/teacher',authenticateUser,authenticateToken,teacherRoutes); 



sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Error connecting to the database', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
