'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {

    static associate(models) {
      
      Equipment.belongsTo(models.Gym, {
        foreignKey: 'gymId',
        as: 'gym',
        onDelete: 'CASCADE',
        hooks: true,
      });

      Equipment.hasMany(models.RepairRequest, {
        foreignKey: 'equipmentId',
        as: 'repairRequests',
        onDelete: 'CASCADE'
      });
    }
  }

  Equipment.init({
    gymId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Gyms',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serialNumber: {
      type: DataTypes.STRING
    },

  }, {
    sequelize,
    modelName: 'Equipment',
    tableName: 'Equipments',
  });
  return Equipment;
};