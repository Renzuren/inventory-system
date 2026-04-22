const Workspace = require('../models/Workspace');

const getWorkspaces = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const workspaces = await Workspace.findAllByUser(userId);
    res.json(workspaces);
  } catch (error) {
    next(error);
  }
};

const createWorkspace = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Workspace name required' });

    const workspace = await Workspace.create(userId, name);
    res.status(201).json(workspace);
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const deleteWorkspace = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await Workspace.delete(id, userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkspaces, createWorkspace, deleteWorkspace };