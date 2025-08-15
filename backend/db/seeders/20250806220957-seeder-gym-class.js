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
       // =========================
      // Gym 1: Venice Muscle Haus
      // =========================
      ...['2025-08-21','2025-08-22','2025-08-23','2025-08-24','2025-08-25','2025-08-26','2025-08-27'].flatMap(date => ([
        { gymId: 1, instructorId: 4, name: 'Sunrise Yoga', description: 'Start your day with gentle yoga and ocean vibes.', date, time: '07:00:00', duration: 60, capacity: 15, location: 'Yoga Deck' },
        { gymId: 1, instructorId: 5, name: 'Power Pilates', description: 'Sculpt, strengthen, and stretch with Pilates fusion.', date, time: '09:00:00', duration: 60, capacity: 15, location: 'Studio A' },
        { gymId: 1, instructorId: 6, name: 'HIIT Happens', description: 'Quick and intense workout to push your limits.', date, time: '12:00:00', duration: 45, capacity: 20, location: 'Studio B' },
        { gymId: 1, instructorId: 4, name: 'Evening Stretch', description: 'Relaxing stretches to end the day.', date, time: '18:00:00', duration: 45, capacity: 15, location: 'Yoga Deck' },
      ])),

      // =========================
      // Gym 2: Silver Lake Strength Haus
      // =========================
      ...['2025-08-21','2025-08-22','2025-08-23','2025-08-24','2025-08-25','2025-08-26','2025-08-27'].flatMap(date => ([
        { gymId: 2, instructorId: 7, name: 'Zen Flow', description: 'Unwind with calming yoga for mind and body.', date, time: '08:30:00', duration: 60, capacity: 12, location: 'Yoga Room' },
        { gymId: 2, instructorId: 8, name: 'Strength Circuit', description: 'Build strength and endurance with circuits.', date, time: '10:30:00', duration: 50, capacity: 18, location: 'Weight Floor' },
        { gymId: 2, instructorId: 9, name: 'Mobility Moves', description: 'Improve flexibility and functional movement.', date, time: '14:00:00', duration: 45, capacity: 15, location: 'Studio C' },
        { gymId: 2, instructorId: 7, name: 'Evening HIIT', description: 'End the day with a calorie-torching HIIT session.', date, time: '18:30:00', duration: 45, capacity: 20, location: 'Studio C' },
      ])),

      // =========================
      // Gym 3: Hollywood Flex Haus
      // =========================
      ...['2025-08-21','2025-08-22','2025-08-23','2025-08-24','2025-08-25','2025-08-26','2025-08-27'].flatMap(date => ([
        { gymId: 3, instructorId: 10, name: 'Ride or Die', description: 'Epic spin session with Hollywood energy.', date, time: '07:00:00', duration: 50, capacity: 18, location: 'Spin Studio' },
        { gymId: 3, instructorId: 4, name: 'Hollywood Bootcamp', description: 'Full-body workout with strength and cardio.', date, time: '09:00:00', duration: 60, capacity: 20, location: 'Main Floor' },
        { gymId: 3, instructorId: 5, name: 'Dance Haus', description: 'Cardio dance party with high-energy music.', date, time: '12:00:00', duration: 50, capacity: 25, location: 'Dance Studio' },
        { gymId: 3, instructorId: 10, name: 'Evening Spin', description: 'End your day with an energizing spin session.', date, time: '18:00:00', duration: 50, capacity: 18, location: 'Spin Studio' },
      ])),

      // =========================
      // Gym 4: Echo Park Power Haus
      // =========================
      ...['2025-08-21','2025-08-22','2025-08-23','2025-08-24','2025-08-25','2025-08-26','2025-08-27'].flatMap(date => ([
        { gymId: 4, instructorId: 6, name: 'WOD Warriors', description: 'Crush your Workout of the Day like a champ.', date, time: '06:30:00', duration: 60, capacity: 16, location: 'CrossFit Zone' },
        { gymId: 4, instructorId: 7, name: 'Barbell Basics', description: 'Master the fundamentals of weightlifting.', date, time: '12:00:00', duration: 45, capacity: 15, location: 'Weightlifting Area' },
        { gymId: 4, instructorId: 8, name: 'Evening Sweat', description: 'Burn calories with this evening HIIT blast.', date, time: '18:30:00', duration: 45, capacity: 20, location: 'Studio A' },
        { gymId: 4, instructorId: 6, name: 'Mobility & Stretch', description: 'Improve flexibility and recover after workouts.', date, time: '20:00:00', duration: 30, capacity: 15, location: 'Studio B' },
      ])),

      // =========================
      // Gym 5: DTLA Cardio Haus
      // =========================
      ...['2025-08-21','2025-08-22','2025-08-23','2025-08-24','2025-08-25','2025-08-26','2025-08-27'].flatMap(date => ([
        { gymId: 5, instructorId: 9, name: 'Downtown Spin', description: 'High-energy spin class overlooking the city.', date, time: '06:30:00', duration: 50, capacity: 18, location: 'Spin Room' },
        { gymId: 5, instructorId: 10, name: 'Lunchtime Burn', description: 'Fast-paced workout for busy professionals.', date, time: '12:15:00', duration: 30, capacity: 20, location: 'Studio B' },
        { gymId: 5, instructorId: 4, name: 'Friday Night Flow', description: 'Relax with yoga to end your work week.', date, time: '18:30:00', duration: 60, capacity: 15, location: 'Yoga Studio' },
        { gymId: 5, instructorId: 5, name: 'Cardio Blast', description: 'High-intensity cardio for maximum calorie burn.', date, time: '19:30:00', duration: 45, capacity: 20, location: 'Main Floor' },
      ])),
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  }
};
