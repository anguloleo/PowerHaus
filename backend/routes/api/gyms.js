const express = require('express');
const { Gym } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); 

const router = express.Router();

// GET /api/gyms - Get all gyms
router.get('/', async (req, res) => {
  try {
    const gyms = await Gym.findAll();
    res.json({ gyms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get gyms' });
  }
});

// GET /api/gyms/:id - Get gym by ID
router.get('/:id', async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    if (!gym) return res.status(404).json({ message: 'Gym not found' });
    res.json(gym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get gym' });
  }
});

// POST /api/gyms - Create gym (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, address, city, state, zip, latitude, longitude, telephone, hours } = req.body;
    if (!name || !address || !city || !latitude || !longitude || !telephone || !hours) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newGym = await Gym.create({ name, address, city, state, zip, latitude, longitude, telephone, hours });
    res.status(201).json(newGym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create gym' });
  }
});

// PUT /api/gyms/:id - Update gym (protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    if (!gym) return res.status(404).json({ message: 'Gym not found' });

    const { name, address, city, state, zip, latitude, longitude, telephone, hours } = req.body;

    await gym.update({ name, address, city, state, zip, latitude, longitude, telephone, hours });
    res.json(gym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update gym' });
  }
});

// DELETE /api/gyms/:id - Delete gym (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    if (!gym) return res.status(404).json({ message: 'Gym not found' });

    await gym.destroy();
    res.json({ message: 'Gym deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete gym' });
  }
});

module.exports = router;
