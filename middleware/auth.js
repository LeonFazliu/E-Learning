const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).json({ error: 'Token required.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded; // Make user data available in the response
            next(); // User is authenticated, proceed to the next middleware
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.redirect('/auth/login'); // Token is invalid, redirect to login
        }
    } else {
        return res.redirect('/auth/login'); // No token found, redirect to login
    }
};

// Role-based access control middleware
const checkAdminOrTeacher = (req, res, next) => {
    console.log('Request User:', req.user); // Log the user info

    if (!req.user) {
        console.log('User not found');
        return res.status(401).json({ error: 'Unauthorized: No user information.' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        console.log('Access denied for user role:', req.user.role);
        return res.status(403).json({ error: 'Access Denied: You do not have permission to perform this action.' });
    }

    next(); // Proceed to the next middleware or route handler
};
const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access Denied');
    }
};

module.exports = { authenticateToken, checkAdminOrTeacher, authenticateUser, ensureAdmin };
