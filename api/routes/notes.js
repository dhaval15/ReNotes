var express = require('express');
var router = express.Router();

const {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
  getTags,
} = require('../controllers/notes');

router.post('/', createNote);
router.put('/:id', updateNote);
router.get('/:id', getNote);
router.delete('/:id', deleteNote);
router.get('/', getNotes);
router.get('/tags', getTags);

module.exports = router;
