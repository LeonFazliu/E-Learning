const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Make sure you import the User model

class Course extends Model {}

Course.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  instructor: { // Changed to INTEGER for foreign key reference
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true, 
  },
  videoUrl: { // New field for video link
    type: DataTypes.STRING,
    allowNull: true, 
  },
  userId: { // New field to associate a user with the course
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Ensure this matches your Users table name
      key: 'id', // Key in the Users model
    }
  }
}, {
  sequelize,
  modelName: 'Course',
});

// Define associations here
Course.associate = (models) => {
  Course.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'creator', // This will be the alias for the associated user
  });
  // If you want to also associate instructor as a User:
  Course.belongsTo(models.User, {
    foreignKey: 'instructor', // Reference to the instructor
    as: 'instructorDetails', // Alias for instructor details
  });
};

module.exports = Course;
