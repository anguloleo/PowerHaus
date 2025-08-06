'use strict';

const { ClassRegistration } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'ClassRegistrations';

module.exports = {
  async up (queryInterface, Sequelize) {
    await ClassRegistration.bulkCreate([
      { userId: 1, gymClassId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 1, gymClassId: 4, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, gymClassId: 6, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 3, gymClassId: 5, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 4, gymClassId: 7, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 5, gymClassId: 3, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 6, gymClassId: 2, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 7, gymClassId: 6, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 8, gymClassId: 4, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 9, gymClassId: 3, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 10, gymClassId: 7, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 11, gymClassId: 5, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 12, gymClassId: 2, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 13, gymClassId: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 14, gymClassId: 2, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 15, gymClassId: 6, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 16, gymClassId: 5, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 2, gymClassId: 3, createdAt: new Date(), updatedAt: new Date() },  
      { userId: 4, gymClassId: 2, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 8, gymClassId: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 10, gymClassId: 4, createdAt: new Date(), updatedAt: new Date() }, 
      { userId: 12, gymClassId: 7, createdAt: new Date(), updatedAt: new Date() }  
    ], { validate: true, options });

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  },
};
