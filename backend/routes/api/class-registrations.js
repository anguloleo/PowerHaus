const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { ClassRegistration, GymClass, User, Gym } = require('../../db/models');

// GET /api/class-registrations
// Get all registrations for the current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await ClassRegistration.findAll({ 
      where: { userId },
      attributes: ['id', 'userId', 'gymClassId', 'createdAt', 'updatedAt'],
      include: [{
        model: GymClass,
        attributes: ['id', 'name', 'date', 'time', 'capacity', 'location', 'description'],
        include: [{ model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName'] },
        { model: Gym, as: 'gym', attributes: ['id', 'name'] }
      ]
      }],
    });
    return res.json({ Registrations: registrations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching registrations' });
  }
});

// POST /api/class-registrations
// User registers for class
router.post('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { gymClassId } = req.body;

  if (!gymClassId) {
    return res.status(400).json({ message: 'gymClassId is required.' });
  }

  try {
    // Check if user already registered for this class
    const existing = await ClassRegistration.findOne({ where: { userId, gymClassId } });
    if (existing) {
      return res.status(400).json({ message: 'User already registered for this class.' });
    }

    // Check gym class exists
    const gymClass = await GymClass.findByPk(gymClassId);
    if (!gymClass) {
      return res.status(404).json({ message: 'Gym class not found.' });
    }

    // Check class capacity
    const registrationCount = await ClassRegistration.count({ where: { gymClassId } });
    if (registrationCount >= gymClass.capacity) {
      return res.status(400).json({ message: 'Class is full.' });
    }

    // Check for time conflicts 
    const userRegistrations = await ClassRegistration.findAll({ where: { userId } });

    for (let reg of userRegistrations) {
      const regClass = await GymClass.findByPk(reg.gymClassId);
      if (regClass.date === gymClass.date && regClass.time === gymClass.time) {
        return res.status(400).json({ message: 'You have another class at this time.' });
      }
    }

    // Create registration
    const registration = await ClassRegistration.create({ userId, gymClassId });
    return res.status(201).json(registration);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error creating registration.' });
  }
});

// DELETE /api/class-registrations/:id
// Delete a registration (user unenrolls from a class)
router.delete('/:id', requireAuth, async (req, res) => {
  const registrationId = req.params.id;

  try {
    const registration = await ClassRegistration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    await registration.destroy();
    return res.json({ message: 'Registration deleted.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error deleting registration.' });
  }
});

module.exports = router;
