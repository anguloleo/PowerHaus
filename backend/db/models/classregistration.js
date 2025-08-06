'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassRegistration extends Model {

    static associate(models) {
      
      ClassRegistration.belongsTo(models.User, { 
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      ClassRegistration.belongsTo(models.GymClass, 
      { 
        foreignKey: 'gymClassId',
        onDelete: 'CASCADE'
      });
    }
  }


  ClassRegistration.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gymClassId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ClassRegistration',
    indexes: [
    {
      unique: true,  //prevents user registering more than once
      fields: ['userId', 'gymClassId']
    }
  ]
  });

  return ClassRegistration;
};