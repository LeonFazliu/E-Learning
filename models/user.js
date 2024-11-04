const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./course');


const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'teacher', 'admin'), defaultValue: 'user' },
});

User.belongsToMany(Course, { through: 'SavedCourses', as: 'savedCourses' });
Course.belongsToMany(User, { through: 'SavedCourses', as: 'savedByUsers' });

User.hasMany(Course, {
  foreignKey: 'userId',
  as: 'courses', // This will be the alias for the associated courses
});
module.exports = User;
