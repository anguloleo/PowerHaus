'use strict';

const { Equipment } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Equipment';

module.exports = {
  async up (queryInterface, Sequelize) {
    await Equipment.bulkCreate([
      { gymId: 1, name: 'Treadmill', location: 'Cardio Zone 1', serialNumber: 'TRD-0001' },
      { gymId: 1, name: 'Treadmill', location: 'Cardio Zone 2', serialNumber: 'TRD-0002' },
      { gymId: 1, name: 'Elliptical Machine', location: 'Cardio Zone 1', serialNumber: 'ELL-0003' },
      { gymId: 2, name: 'Stationary Bicycle', location: 'Spin Room', serialNumber: 'BKE-0004' },
      { gymId: 2, name: 'Rowing Machine', location: 'Row Area', serialNumber: 'ROW-0005' },
      { gymId: 2, name: 'Leg Press Machine', location: 'Strength Area', serialNumber: 'LPR-0006' },
      { gymId: 3, name: 'Stair Climber', location: 'Cardio Zone 3', serialNumber: 'STC-0007' },
      { gymId: 3, name: 'Cable Crossover', location: 'Strength Area', serialNumber: 'CBC-0008' },
      { gymId: 3, name: 'Lat Pulldown Machine', location: 'Strength Area', serialNumber: 'LTD-0009' },
      { gymId: 4, name: 'Chest Press Machine', location: 'Strength Area', serialNumber: 'CPS-0010' },
      { gymId: 4, name: 'Smith Machine', location: 'Strength Area', serialNumber: 'SMT-0011' },
      { gymId: 4, name: 'Leg Curl Machine', location: 'Strength Area', serialNumber: 'LCR-0012' },
      { gymId: 4, name: 'Leg Extension Machine', location: 'Strength Area', serialNumber: 'LEX-0013' },
      { gymId: 5, name: 'Seated Row Machine', location: 'Strength Area', serialNumber: 'SRM-0014' },
      { gymId: 5, name: 'Pull-Up Bar', location: 'Functional Zone', serialNumber: 'PUB-0015' },
      { gymId: 5, name: 'Dip Station', location: 'Functional Zone', serialNumber: 'DIP-0016' },
      { gymId: 1, name: 'Ab Crunch Machine', location: 'Core Area', serialNumber: 'ACM-0017' },
      { gymId: 1, name: 'Back Extension Machine', location: 'Core Area', serialNumber: 'BEM-0018' },
      { gymId: 2, name: 'Kettlebell Rack', location: 'Free Weights', serialNumber: 'KBR-0019' },
      { gymId: 2, name: 'Dumbbell Rack', location: 'Free Weights', serialNumber: 'DBR-0020' },
      { gymId: 3, name: 'Medicine Ball Rack', location: 'Functional Zone', serialNumber: 'MBR-0021' },
      { gymId: 3, name: 'Battle Ropes', location: 'Functional Zone', serialNumber: 'BTR-0022' },
      { gymId: 3, name: 'Jump Rope', location: 'Functional Zone', serialNumber: 'JRP-0023' },
      { gymId: 4, name: 'Foam Roller', location: 'Recovery Area', serialNumber: 'FOR-0024' },
      { gymId: 4, name: 'Punching Bag', location: 'Boxing Area', serialNumber: 'PBG-0025' },
      { gymId: 4, name: 'Resistance Bands Station', location: 'Functional Zone', serialNumber: 'RBS-0026' },
      { gymId: 5, name: 'Stepper Machine', location: 'Cardio Zone 2', serialNumber: 'STM-0027' },
      { gymId: 5, name: 'Incline Bench Press', location: 'Strength Area', serialNumber: 'IBP-0028' },
      { gymId: 1, name: 'Flat Bench Press', location: 'Strength Area', serialNumber: 'FBP-0029' },
      { gymId: 1, name: 'Preacher Curl Bench', location: 'Strength Area', serialNumber: 'PCB-0030' }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  }
};
