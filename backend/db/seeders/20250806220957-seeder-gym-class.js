'use strict';

const { GymClass } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'GymClasses';

module.exports = {
  async up(queryInterface, Sequelize) {
    await GymClass.bulkCreate([
      // Gym 1: Venice Muscle Haus
      {
        instructorId: 4,
        name: 'Sunrise Yoga',
        description: 'Start your day with gentle yoga and ocean vibes.',
        date: '2025-08-10',
        time: '07:00:00',
        duration: 60,
        capacity: 15,
        gymId: 1,
        location: 'Yoga Deck'
      },
      {
        instructorId: 5,
        name: 'Power Pilates',
        description: 'Sculpt, strengthen, and stretch with Pilates fusion.',
        date: '2025-08-10',
        time: '09:00:00',
        duration: 60,
        capacity: 15,
        gymId: 1,
        location: 'Studio A'
      },
      {
        instructorId: 6,
        name: 'HIIT Happens',
        description: 'Quick and intense workout to push your limits.',
        date: '2025-08-11',
        time: '18:00:00',
        duration: 45,
        capacity: 20,
        gymId: 1,
        location: 'Studio B'
      },

      // Gym 2: Silver Lake Strength Haus
      {
        instructorId: 7,
        name: 'Zen Flow',
        description: 'Unwind with calming yoga for mind and body.',
        date: '2025-08-11',
        time: '08:30:00',
        duration: 60,
        capacity: 12,
        gymId: 2,
        location: 'Yoga Room'
      },
      {
        instructorId: 8,
        name: 'Strength Circuit',
        description: 'Build strength and endurance with circuits.',
        date: '2025-08-12',
        time: '17:00:00',
        duration: 50,
        capacity: 18,
        gymId: 2,
        location: 'Weight Floor'
      },
      {
        instructorId: 9,
        name: 'Mobility Mondays',
        description: 'Improve flexibility and functional movement.',
        date: '2025-08-12',
        time: '10:00:00',
        duration: 45,
        capacity: 15,
        gymId: 2,
        location: 'Studio C'
      },

      // Gym 3: Hollywood Flex Haus
      {
        instructorId: 10,
        name: 'Ride or Die',
        description: 'Epic spin session with Hollywood energy.',
        date: '2025-08-13',
        time: '18:00:00',
        duration: 50,
        capacity: 18,
        gymId: 3,
        location: 'Spin Studio'
      },
      {
        instructorId: 4,
        name: 'Hollywood Bootcamp',
        description: 'Full-body workout with strength and cardio.',
        date: '2025-08-13',
        time: '07:00:00',
        duration: 60,
        capacity: 20,
        gymId: 3,
        location: 'Main Floor'
      },
      {
        instructorId: 5,
        name: 'Dance Haus',
        description: 'Cardio dance party with high-energy music.',
        date: '2025-08-14',
        time: '19:00:00',
        duration: 50,
        capacity: 25,
        gymId: 3,
        location: 'Dance Studio'
      },

      // Gym 4: Echo Park Power Haus
      {
        instructorId: 6,
        name: 'WOD Warriors',
        description: 'Crush your Workout of the Day like a champ.',
        date: '2025-08-14',
        time: '06:30:00',
        duration: 60,
        capacity: 16,
        gymId: 4,
        location: 'CrossFit Zone'
      },
      {
        instructorId: 7,
        name: 'Barbell Basics',
        description: 'Master the fundamentals of weightlifting.',
        date: '2025-08-15',
        time: '12:00:00',
        duration: 45,
        capacity: 15,
        gymId: 4,
        location: 'Weightlifting Area'
      },
      {
        instructorId: 8,
        name: 'Evening Sweat',
        description: 'Burn calories with this evening HIIT blast.',
        date: '2025-08-15',
        time: '18:30:00',
        duration: 45,
        capacity: 20,
        gymId: 4,
        location: 'Studio A'
      },

      // Gym 5: DTLA Cardio Haus
      {
        instructorId: 9,
        name: 'Downtown Spin',
        description: 'High-energy spin class overlooking the city.',
        date: '2025-08-16',
        time: '06:30:00',
        duration: 50,
        capacity: 18,
        gymId: 5,
        location: 'Spin Room'
      },
      {
        instructorId: 10,
        name: 'Lunchtime Burn',
        description: 'Fast-paced workout for busy professionals.',
        date: '2025-08-16',
        time: '12:15:00',
        duration: 30,
        capacity: 20,
        gymId: 5,
        location: 'Studio B'
      },
      {
        instructorId: 4,
        name: 'Friday Night Flow',
        description: 'Relax with yoga to end your work week.',
        date: '2025-08-16',
        time: '18:30:00',
        duration: 60,
        capacity: 15,
        gymId: 5,
        location: 'Yoga Studio'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  }
};
