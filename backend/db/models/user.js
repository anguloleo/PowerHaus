'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      
      // Student for Gym class
      User.hasMany(models.ClassRegistration, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      // Student for Gym Class
      User.belongsToMany(models.GymClass, {
        through: models.ClassRegistration,
        foreignKey: 'userId',
        otherKey: 'gymClassId'
      });

      // Instructor for Gym Class
      User.hasMany(models.GymClass, {
        as: 'InstructedClasses',
        foreignKey: 'instructorId'
      });

      User.hasMany(models.RepairRequest, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.UserMetrics, {
        foreignKey: 'userId',
        as: 'metrics', 
        onDelete: 'CASCADE',
      });
    }
  }


  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      role: {
        type: DataTypes.ENUM('member', 'instructor', 'trainer', 'staff', 'admin'),
        allowNull: false,
        defaultValue: 'member'
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      }
    }
  );
  return User;
};