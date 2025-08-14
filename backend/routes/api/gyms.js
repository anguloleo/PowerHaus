const express = require('express');
const { requireAuth } = require('../../utils/auth'); 
const { Gym, GymClass, Equipment } = require('../../db/models');


const router = express.Router();

//GET ALL GYMS
// /api/gyms 
router.get('/', async (req, res) => {
  try {
    const gyms = await Gym.findAll();
    res.json({ gyms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get gyms' });
  }
});

// GET SINGLE GYM
//  /api/gyms/:id 
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

// CREATE GYM
//  /api/gyms
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

// UPDATE GYM
//  /api/gyms/:id
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

//DELETE GYM
// /api/gyms/:id 
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



//GET ALL EQUIPMENT FROM A GYM
// GET /api/gyms/:gymId/equipment
router.get('/:gymId/equipment', async (req, res) => {
  try {
    const { gymId } = req.params;

  const gym = await Gym.findByPk(gymId);
  if (!gym) {
    return res.status(404).json({ message: "Gym not found" });
  }

  const equipmentList = await Equipment.findAll({
    where: { gymId },
    attributes: ['id', 'name'] 
  });

  return res.json(equipmentList);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get equipment" });
  }
});

// GET ALL CLASSES FROM A GYM
// /api/gyms/:gymId/classes
router.get('/:gymId/classes', async (req, res) => {
  const { gymId } = req.params;
  const classes = await GymClass.findAll({ where: { gymId } });
  res.json({ GymClasses: classes });
});

module.exports = router;
