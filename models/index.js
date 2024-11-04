// models/index.js
const sequelize = require('../config/database');
const User = require('./user');
const Course = require('./course');
const UserCourse = require('./UserCourse'); // Import UserCourse

// Define associations
UserCourse.associate({ User, Course }); // Associate UserCourse with User and Course

sequelize.sync();

module.exports = { User, Course, UserCourse }; // Export UserCourse
