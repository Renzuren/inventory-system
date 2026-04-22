const express = require('express');
const authenticateToken = require('../middleware/auth');
const {
  getInventory,
  addItem,
  updateItem,
  deleteItem,
  getStats,
  exportCSV,
  bulkAddItems,
  getRecentHistory,
} = require('../controllers/inventoryController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getInventory);
router.post('/', addItem);
router.post('/bulk', bulkAddItems);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);
router.get('/stats', getStats);
router.get('/export', exportCSV);
router.get('/history/recent', getRecentHistory);

module.exports = router;