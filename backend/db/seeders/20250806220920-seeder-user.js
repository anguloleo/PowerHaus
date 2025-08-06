'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([

      //admin
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demouser@io.com',
        username: 'Demolition',
        hashedPassword: bcrypt.hashSync('password'),
        role: 'admin'
      },

      // Staff
      {
        firstName: 'Sam',
        lastName: 'Staffer',
        email: 'sam.staff@gymapp.com',
        username: 'StaffSam',
        hashedPassword: bcrypt.hashSync('staff123'),
        role: 'staff'
      },
      {
        firstName: 'Jess',
        lastName: 'Helper',
        email: 'jess.staff@gymapp.com',
        username: 'JessHelper',
        hashedPassword: bcrypt.hashSync('staffpower'),
        role: 'staff'
      },

      // Instructors 
      {
        firstName: 'Chad',
        lastName: 'Thundercode',
        email: 'chad@buffmail.com',
        username: 'ChadTheDev',
        hashedPassword: bcrypt.hashSync('gymbro123'),
        role: 'instructor'
      },
      {
        firstName: 'Karen',
        lastName: 'McManager',
        email: 'karen@letmespeak.com',
        username: 'ManagerVibes',
        hashedPassword: bcrypt.hashSync('complaint1'),
        role: 'instructor'
      },
      {
        firstName: 'Rick',
        lastName: 'Roll',
        email: 'rick@nevergonnagiveyouup.io',
        username: 'RickAstley',
        hashedPassword: bcrypt.hashSync('neverGonna123'),
        role: 'instructor'
      },
      {
        firstName: 'Luna',
        lastName: 'Tic',
        email: 'luna@spacecase.io',
        username: 'MoonyLoony',
        hashedPassword: bcrypt.hashSync('stars123'),
        role: 'instructor'
      },
      {
        firstName: 'Bob',
        lastName: 'Builder',
        email: 'bob@construct.io',
        username: 'YesWeCan',
        hashedPassword: bcrypt.hashSync('toolbox456'),
        role: 'instructor'
      },
      {
        firstName: 'Ada',
        lastName: 'Bug',
        email: 'ada@debug.io',
        username: 'BugSquasher',
        hashedPassword: bcrypt.hashSync('codefixer789'),
        role: 'instructor'
      },
      {
        firstName: 'Harry',
        lastName: 'Putter',
        email: 'harry@golfmail.com',
        username: 'WizardGolfer',
        hashedPassword: bcrypt.hashSync('expelliarmisshot'),
        role: 'instructor'
      },

      // Members 
      {
        firstName: 'Sally',
        lastName: 'Sloth',
        email: 'sally@lazyzone.com',
        username: 'SlowMoQueen',
        hashedPassword: bcrypt.hashSync('napmaster1'),
        role: 'member'
      },
      {
        firstName: 'Elon',
        lastName: 'Dust',
        email: 'elon@spacedout.com',
        username: 'MartianDreams',
        hashedPassword: bcrypt.hashSync('starlinkup'),
        role: 'member'
      },
      {
        firstName: 'Tina',
        lastName: 'Taco',
        email: 'tina@nachonacho.com',
        username: 'CrunchWrapQueen',
        hashedPassword: bcrypt.hashSync('extraGuac'),
        role: 'member'
      },
      {
        firstName: 'Greg',
        lastName: 'OnTheGo',
        email: 'greg@rushmail.io',
        username: 'SpeedyGreg',
        hashedPassword: bcrypt.hashSync('alwaysLate'),
        role: 'member'
      },
      {
        firstName: 'Frodo',
        lastName: 'Baggins',
        email: 'frodo@shiremail.com',
        username: 'RingBearer42',
        hashedPassword: bcrypt.hashSync('myPrecious1'),
        role: 'member'
      },
      {
        firstName: 'Simone',
        lastName: 'Says',
        email: 'simone@simon.io',
        username: 'DoWhatISay',
        hashedPassword: bcrypt.hashSync('redlightgreenlight'),
        role: 'member'
      },
      {
        firstName: 'Waldo',
        lastName: 'Nowhere',
        email: 'waldo@hiddenmail.com',
        username: 'WhereAmI',
        hashedPassword: bcrypt.hashSync('findme123'),
        role: 'member'
      },
      {
        firstName: 'Captain',
        lastName: 'Obvious',
        email: 'captain@duhmail.com',
        username: 'WellActually',
        hashedPassword: bcrypt.hashSync('youreWelcome'),
        role: 'member'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { 
        [Op.in]: [
          'AdminBoss',
          'StaffSam',
          'JessHelper',
          'ChadTheDev',
          'ManagerVibes',
          'RickAstley',
          'MoonyLoony',
          'YesWeCan',
          'BugSquasher',
          'WizardGolfer',
          'SlowMoQueen',
          'MartianDreams',
          'CrunchWrapQueen',
          'SpeedyGreg',
          'RingBearer42',
          'DoWhatISay',
          'WhereAmI',
          'WellActually'
        ]
      }
    }, {});
  }
};