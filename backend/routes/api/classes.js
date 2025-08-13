const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');


const { GymClass } = require('../../db/models'); 

const validateGymClass = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Class name is required.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('startTime')
    .exists({ checkFalsy: true })
    .withMessage('Start time is required.'),
  check('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number.'),
  handleValidationErrors
];

// GET /api/gym-classes - list all classes
router.get('/', async (req, res) => {
  try {
    const classes = await GymClass.findAll();
    res.json({ GymClasses: classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
});

// GET /api/gym-classes/:id - get single class by ID
router.get('/:id', async (req, res) => {
  try {
    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(gymClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching class' });
  }
});

// POST /api/gym-classes - create new class
router.post('/', requireAuth, validateGymClass, async (req, res) => {
  try {
    const newClass = await GymClass.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating class', errors: err.errors });
  }
});

// PUT /api/gym-classes/:id - update class by ID
router.put('/:id', requireAuth, validateGymClass, async (req, res) => {
  try {
    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await gymClass.update(req.body);
    res.json(gymClass);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating class', errors: err.errors });
  }
});

// DELETE /api/gym-classes/:id - delete class by ID
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await gymClass.destroy();
    res.json({ message: 'Class deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting class' });
  }
});

module.exports = router;
