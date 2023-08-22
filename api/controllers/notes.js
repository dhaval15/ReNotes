const fs = require('fs');
const path = require('path');
const marked = require('marked');
const slugify = require('slugify');
const yaml = require('js-yaml');
const { globSync } = require('glob');

const notesDir = '/home/dhaval/Hive/projects/ReNotes/notes';

const readNoteFile = id => {
	try {
		const files = globSync(`${notesDir}/${id}-*.md`);
		const filePath = files[0];
  	return fs.readFileSync(filePath, 'utf-8');
	}
	catch (error) {
		console.error(`No file found with ${id}`);
	}
};

const parseMetadata = content => {
  const match = content.match(/---\n([\s\S]*?)\n---/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]);
			metadata.tags = metadata.tags.split(' ');
      return metadata;
    } catch (error) {
      console.error('Error parsing YAML metadata:', error);
    }
  }
  return {};
};

const createNote = (req, res) => {
  try {
    const { content } = req.body;
    const id = Date.now(); // Generate a unique ID
    const metadata = parseMetadata(content);
    const { title, tags, createdOn } = metadata;
    const slug = slugify(title, { lower: true });
    const filePath = path.join(notesDir, `${id}-${slug}.md`);
    
    fs.writeFileSync(filePath, content);
    
    const note = { id, title, tags, createdOn };
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the note' });
  }
};

const updateNote = (req, res) => {
  try {
    const id = req.params.id;
    const note = readNoteFile(id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    
    const { content } = req.body;
    const metadata = parseMetadata(content);
    const { title, tags, createdOn } = metadata;
    const slug = slugify(title, { lower: true });
    const filePath = path.join(notesDir, `${id}-${slug}.md`);
    
    fs.writeFileSync(filePath, content);
    
    const updatedNote = { id, title, tags, createdOn };
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the note' });
  }
};

const getNote = (req, res) => {
  try {
    const id = req.params.id;
    const content = readNoteFile(id);
    if (!content) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    
    const metadata = parseMetadata(content);
    const { title, tags, createdOn } = metadata;
    res.json({ id, title, tags, createdOn, content });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the note' });
  }
};

const deleteNote = (req, res) => {
  try {
    const id = req.params.id;
    const note = readNoteFile(id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    
    const filePath = path.join(notesDir, `${id}-${parseMetadata(note).titleSlug}.md`);
    fs.unlinkSync(filePath);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the note' });
  }
};

const getNotes = (req, res) => {
  try {
    // const includeTags = req.query.include_tags ? req.query.include_tags.split(',') : [];
    // const excludeTags = req.query.exclude_tags ? req.query.exclude_tags.split(',') : [];

    const notePaths = fs.readdirSync(notesDir);
		const notes = notePaths.map(path => {
        const id = path.split('-')[0];
        const noteContent = readNoteFile(id);
        const metadata = parseMetadata(noteContent);
        return {
          id,
          ...metadata,
        };
		});

    res.json(notes);
  } catch (error) {
		throw error;
    //res.status(500).json({ message: 'An error occurred while retrieving notes' });
  }
};

const getTags = (req, res) => {
  try {
    // Implement logic to retrieve a list of unique tags from notes
    res.json(/* List of unique tags */);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving tags' });
  }
};

module.exports = {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
  getTags,
};
