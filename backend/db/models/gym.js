'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Gym extends Model {
  
    static associate(models) {

      Gym.hasMany(models.GymClass, { 
        foreignKey: 'gymId' 
      });

      Gym.hasMany(models.Equipment, {
        foreignKey: 'gymId',
        onDelete: 'CASCADE', 
        hooks: true,        
      });
    }
  }


  Gym.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 2]
      }
    },
    zip: {
      type: DataTypes.STRING,
      validate: {
      len: [5, 10]
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hours: {
      type: DataTypes.STRING, 
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Gym',
  });
  return Gym;
};