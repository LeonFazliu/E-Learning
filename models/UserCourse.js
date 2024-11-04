// models/UserCourse.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserCourse extends Model {}

UserCourse.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'UserCourse',
});

// Relationships
UserCourse.associate = (models) => {
  UserCourse.belongsTo(models.User, { foreignKey: 'userId' });
  UserCourse.belongsTo(models.Course, { foreignKey: 'courseId' });
};

module.exports = UserCourse;
