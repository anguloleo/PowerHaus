const express = require('express');
const router = express.Router();
const { RepairRequest, Equipment } = require('../../db/models');
const { requireAuth } = require('../../utils/auth'); // Make sure this path is correct
const equipment = require('../../db/models/equipment');



// Get all repair requests (with role filtering)
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user; 

    let repairRequests;
    if (user.role === 'admin' || user.role === 'staff') {
      // Show all requests for admin/staff
      repairRequests = await RepairRequest.findAll({
        include: [{
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name']
        }]
      });
    } else {
      // Show only the logged-in member's requests
      repairRequests = await RepairRequest.findAll({
        where: { userId: user.id },
         include: [{
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name']
        }]
      });
    }

    res.json(repairRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Get a single repair request by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const repairRequest = await RepairRequest.findByPk(req.params.id);
    if (!repairRequest) return res.status(404).json({ error: 'Repair request not found' });

    // Allow admin/staff to see any request, members only their own
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'staff' &&
      repairRequest.userId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(repairRequest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repair request' });
  }
});

// Create a new repair request
router.post('/', requireAuth, async (req, res) => {
  try {
    const { equipmentId, description, status, imageUrl } = req.body;
    const newRequest = await RepairRequest.create({
      equipmentId,
      userId: req.user.id, // Always set to logged-in user
      description,
      status: status || 'open',
      imageUrl
    });
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create repair request', details: err.message });
  }
});

// Update a repair request by ID
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { description, status, imageUrl } = req.body;
    const repairRequest = await RepairRequest.findByPk(req.params.id);
    if (!repairRequest) return res.status(404).json({ error: 'Repair request not found' });

    // Only admin/staff or owner can update
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'staff' &&
      repairRequest.userId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await repairRequest.update({ description, status, imageUrl });
    res.json(repairRequest);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update repair request', details: err.message });
  }
});

// Delete a repair request by ID
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const repairRequest = await RepairRequest.findByPk(req.params.id);
    if (!repairRequest) return res.status(404).json({ error: 'Repair request not found' });

    // Only admin/staff or owner can delete
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'staff' &&
      repairRequest.userId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await repairRequest.destroy();
    res.json({ message: 'Repair request deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete repair request' });
  }
});

module.exports = router;
