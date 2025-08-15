'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GymClass extends Model {

    static associate(models) {

      //Class belongs to gym
      GymClass.belongsTo(models.Gym, { 
        as: 'gym',
        foreignKey: 'gymId' });
      
      //Class is taught by user (instructor)
      GymClass.belongsTo(models.User, {
        as: 'instructor', 
        foreignKey: 'instructorId'
      });

      // Class has many registrations
      GymClass.hasMany(models.ClassRegistration, {
        foreignKey: 'gymClassId',
        onDelete: 'CASCADE',
      });

      // Users can register for classes through ClassRegistration
      GymClass.belongsToMany(models.User, {
        through: models.ClassRegistration,
        foreignKey: 'gymClassId',
        otherKey: 'userId'
      });
    }
  }


  GymClass.init({
    gymId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Gyms',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
   instructorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GymClass',
  });


  return GymClass;
};