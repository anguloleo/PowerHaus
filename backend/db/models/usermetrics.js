'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserMetrics extends Model {
    static associate(models) {

      // Associate UserMetrics with Users
      UserMetrics.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    // Virtual getter for total height in inches
    get totalInches() {
      return (this.heightFeet || 0) * 12 + (this.heightInches || 0);
    }

    // Optional method to calculate BMI dynamically
    get calculatedBmi() {
      if (this.weightLbs && this.totalInches) {
        return (this.weightLbs / (this.totalInches ** 2)) * 703;
      }
      return null;
    }
  }

  UserMetrics.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weightLbs: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      heightFeet: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      heightInches: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bmi: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bodyFatPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserMetrics',
      tableName: 'UserMetrics',
    }
  );

  // Hook to automatically calculate BMI before creating a record
  UserMetrics.beforeValidate((metrics) => {
     metrics.weightLbs = Number(metrics.weightLbs);
    metrics.heightFeet = Number(metrics.heightFeet);
    metrics.heightInches = Number(metrics.heightInches);
    metrics.bmi = metrics.calculatedBmi;
  });

  // Hook to automatically calculate BMI before updating a record
  UserMetrics.beforeUpdate((metrics) => {
    metrics.bmi = metrics.calculatedBmi;
  });

  return UserMetrics;
};
