'use strict';

const { UserMetrics } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await UserMetrics.bulkCreate([
        {
          userId: 11,
          date: '2025-01-01',
          weightLbs: 180,
          heightFeet: 5,
          heightInches: 10,
          bmi: (180 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 20,
          photoUrl: 'https://images.pexels.com/photos/6551070/pexels-photo-6551070.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-02-01',
          weightLbs: 178,
          heightFeet: 5,
          heightInches: 10,
          bmi: (178 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 19.5,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-03-01',
          weightLbs: 176,
          heightFeet: 5,
          heightInches: 10,
          bmi: (176 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 19,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-04-01',
          weightLbs: 174,
          heightFeet: 5,
          heightInches: 10,
          bmi: (174 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 18.5,
          photoUrl: 'https://images.pexels.com/photos/5629206/pexels-photo-5629206.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-05-01',
          weightLbs: 172,
          heightFeet: 5,
          heightInches: 10,
          bmi: (172 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 18,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-06-01',
          weightLbs: 170,
          heightFeet: 5,
          heightInches: 10,
          bmi: (170 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 17.5,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-07-01',
          weightLbs: 168,
          heightFeet: 5,
          heightInches: 10,
          bmi: (168 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 17,
          photoUrl: 'https://images.pexels.com/photos/6551059/pexels-photo-6551059.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-08-01',
          weightLbs: 166,
          heightFeet: 5,
          heightInches: 10,
          bmi: (166 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 16.5,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-09-01',
          weightLbs: 164,
          heightFeet: 5,
          heightInches: 10,
          bmi: (164 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 16,
          photoUrl: 'https://images.pexels.com/photos/5622199/pexels-photo-5622199.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 11,
          date: '2025-10-01',
          weightLbs: 162,
          heightFeet: 5,
          heightInches: 10,
          bmi: (162 / ((5 * 12 + 10) ** 2)) * 703,
          bodyFatPercentage: 15.5,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  }
};
