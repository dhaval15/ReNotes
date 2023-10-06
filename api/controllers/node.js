const service = require('../service');

// GET a node by ID
const getNode = async (req, res) => {
  const { name, id } = req.params;
  try {
    const node = await service.getNode(name, id);
    res.json(node);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch node' });
  }
};

// POST create a new node
const createNode = async (req, res) => {
  const { name } = req.params;
  const { title, tags, content, extras } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newNode = await service.createNode(name, title, tags, content, extras);
    res.status(201).json(newNode);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create node' });
  }
};

// DELETE a node by ID
const deleteNode = async (req, res) => {
  const { name, id } = req.params;

  try {
    await service.deleteNode(name, id);
    res.status(204).send(); // No content on success
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete node' });
  }
};

// PUT update a node by ID
const updateNode = async (req, res) => {
  const { name, id } = req.params;
  const { content, updatedData } = req.body;
  if (!name || !id) {
    return res.status(400).json({ error: 'Collection and Id is required' });
  }

  try {
    const updatedNode = await service.updateNode(name, id, content, updatedData);
    res.json(updatedNode);
  } catch (err) {
		console.log(err);
    res.status(500).json({ error: 'Unable to update node' });
  }
};

module.exports = {
	getNode,
	createNode,
	updateNode,
	deleteNode,
};

