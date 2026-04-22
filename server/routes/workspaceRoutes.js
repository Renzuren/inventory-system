const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getWorkspaces, createWorkspace, deleteWorkspace } = require('../controllers/workspaceController');

const router = express.Router();

// All workspace routes require authentication
router.use(authenticateToken);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.delete('/:id', deleteWorkspace);

module.exports = router;