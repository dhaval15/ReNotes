const service = require('../service');

// GET all collections
const getCollections = async (req, res) => {
  try {
    const collections = await service.getAllCollections();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch collections' });
  }
};

// POST create a collection
const createCollection = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Collection name is required' });
  }

  try {
    const collection = await service.createCollection(name);
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create collection' });
  }
};

// DELETE a collection
const deleteCollection = async (req, res) => {
  const { name } = req.params;
  const { drop } = req.body;

  try {
    await service.deleteCollection(name, drop);
    res.status(204).send(); // No content on success
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete collection' });
  }
};

// GET a collection by name
const getCollection = async (req, res) => {
  const { name } = req.params;

  try {
    const collection = await service.getCollectionByName(name);
    res.json(collection);
  } catch (err) {
		console.log(err);
    res.status(500).json({ error: 'Unable to fetch collection' });
  }
};

module.exports = {
  getCollections,
  createCollection,
  deleteCollection,
  getCollection,
};
