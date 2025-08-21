const express = require('express');
const router = express.Router();
const { UserMetrics, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); 

// -----------------------------
// Create a new progress entry
// -----------------------------
router.post('/', requireAuth, async (req, res) => {
  try {
    const { date, weightLbs, heightFeet, heightInches, bodyFatPercentage, photoUrl } = req.body;

    const newMetrics = await UserMetrics.create({
      userId: req.user.id,
      date,
      weightLbs,
      heightFeet,
      heightInches,
      bodyFatPercentage,
      photoUrl,
    });

    return res.status(201).json(newMetrics);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to create progress entry.' });
  }
});

// -----------------------------
// Get all progress entries for a user
// -----------------------------
router.get('/', requireAuth, async (req, res) => {
  try {
    const metrics = await UserMetrics.findAll({
      where: { userId: req.user.id },
      order: [['date', 'ASC']],
    });

    return res.json(metrics);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to fetch progress entries.' });
  }
});

// -----------------------------
// Get a single progress entry by ID
// -----------------------------
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const metrics = await UserMetrics.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!metrics) {
      return res.status(404).json({ error: 'Progress entry not found.' });
    }

    return res.json(metrics);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to fetch progress entry.' });
  }
});

// -----------------------------
// Update a progress entry
// -----------------------------
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const metrics = await UserMetrics.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!metrics) {
      return res.status(404).json({ error: 'Progress entry not found.' });
    }

    const { date, weightLbs, heightFeet, heightInches, bodyFatPercentage, photoUrl } = req.body;

    await metrics.update({
      date: date ?? metrics.date,
      weightLbs: weightLbs ?? metrics.weightLbs,
      heightFeet: heightFeet ?? metrics.heightFeet,
      heightInches: heightInches ?? metrics.heightInches,
      bodyFatPercentage: bodyFatPercentage ?? metrics.bodyFatPercentage,
      photoUrl: photoUrl ?? metrics.photoUrl,
    });

    return res.json(metrics);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to update progress entry.' });
  }
});

// -----------------------------
// Delete a progress entry
// -----------------------------
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const metrics = await UserMetrics.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!metrics) {
      return res.status(404).json({ error: 'Progress entry not found.' });
    }

    await metrics.destroy();
    return res.json({ message: 'Progress entry deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to delete progress entry.' });
  }
});

module.exports = router;
