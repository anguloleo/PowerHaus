const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');


const { GymClass, Gym, User } = require('../../db/models'); 


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

//GET ALL CLASSES
// GET /api/classes 
router.get('/', async (req, res) => {
  try {
    const classes = await GymClass.findAll({
      include: [
        { model: Gym, as: 'gym' },
        { model: User, as: 'instructor' }
      ],
    });
    res.json({ GymClasses: classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
});

// GET SINGLE CLASS
// GET /api/classes/:id
router.get('/:id', async (req, res) => {
  try {
    const gymClass = await GymClass.findByPk(req.params.id, {
      include: [
        { model: Gym, as: 'gym' },
        { model: User, as: 'instructor', attributes: ["id", "firstName", "lastName"] }
      ],
    });


    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ gymClass });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching class' });
  }
});

//CREATE CLASS
// POST /api/classes 
router.post('/', requireAuth, validateGymClass, async (req, res) => {
  try {
    const newClass = await GymClass.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating class', errors: err.errors });
  }
});

//UPDATE CLASS
// PUT /api/classes/:id 
router.put('/:id', requireAuth, validateGymClass, async (req, res) => {
  try {
    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

        // Only allow admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    await gymClass.update(req.body);
    res.json(gymClass);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating class', errors: err.errors });
  }
});

//DELETE CLASS
// DELETE /api/classes/:id 
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
