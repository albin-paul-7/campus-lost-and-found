const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  claimItem,
  getMyItems,
  getStats
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Public read routes
router.get('/', getItems);
router.get('/stats', getStats);

// Protected user routes (MUST be declared before /:id parameterized route)
router.get('/user/my-items', protect, getMyItems);

// Single item read
router.get('/:id', getItemById);

// Create item
router.post('/', protect, createItem);
router.post('/add', protect, createItem); // Backwards compatibility for early drafts

// Update & Delete (Protected with ownership check in controller)
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/status', protect, updateItemStatus);

// Claim an item
router.post('/:id/claim', protect, claimItem);

module.exports = router;
