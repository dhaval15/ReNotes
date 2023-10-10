const service = require('../service');

const getContent = async (req, res) => {
  const { collection, node } = req.params;
  if (!collection || !node) {
    return res.status(400).json({ error: 'Collection and Node is required' });
  }
  try {
    const result = await service.getContent(collection, node);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch content' });
  }
};

const postContent = async (req, res) => {
  const { collection, node } = req.params;
  const { content } = req.body;
  if (!collection || !node || !content) {
    return res.status(400).json({ error: 'Collection, Node and Content is required' });
  }

  try {
    await service.postContent(collection, node, content);
    res.json(updatedNode);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: 'Unable to update content' });
  }
};

module.exports = {
	getContent,
	postContent,
};
