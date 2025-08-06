'use strict';

const { Gym } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Gyms';

module.exports = {
  async up (queryInterface, Sequelize) {
    await Gym.bulkCreate([
   {
        name: 'Venice Muscle Haus',
        address: '123 Boardwalk Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90291', // Venice Beach
        latitude: 33.9850,
        longitude: -118.4695,
        telephone: '(310) 555-0101',
        hours: '6:00 AM - 10:00 PM',
      },
      {
        name: 'Silver Lake Strength Haus',
        address: '456 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90026', // Silver Lake
        latitude: 34.0866,
        longitude: -118.2605,
        telephone: '(323) 555-0202',
        hours: '5:00 AM - 11:00 PM',
      },
      {
        name: 'Hollywood Flex Haus',
        address: '789 Vine St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90028', // Hollywood
        latitude: 34.1016,
        longitude: -118.3269,
        telephone: '(323) 555-0303',
        hours: '6:00 AM - 12:00 AM',
      },
      {
        name: 'Echo Park Power Haus',
        address: '101 Echo Park Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90026', // Echo Park
        latitude: 34.0782,
        longitude: -118.2605,
        telephone: '(323) 555-0404',
        hours: '5:30 AM - 11:30 PM',
      },
      {
        name: 'DTLA Cardio Haus',
        address: '202 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90014', // Downtown LA
        latitude: 34.0407,
        longitude: -118.2468,
        telephone: '(213) 555-0505',
        hours: '6:00 AM - 10:00 PM',
      },
    ], { validate: true });
  },


  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  },

};
