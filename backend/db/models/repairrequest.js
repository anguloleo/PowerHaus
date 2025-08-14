'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RepairRequest extends Model {
    static associate(models) {
      
      RepairRequest.belongsTo(models.Equipment, {
        foreignKey: 'equipmentId',
        as: 'equipment',
        onDelete: 'CASCADE'
      });

      RepairRequest.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'SET NULL'
      });

    }
  }

  RepairRequest.init({

    equipmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Resolved'),
      allowNull: false,
      defaultValue: 'Open'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RepairRequest',
  });

  return RepairRequest;
};
