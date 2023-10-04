const path = require('path');
const rootDir = process.env.RENOTES_DATA_DIR; // Replace with your root directory path
const IndexDB = require('./index-db');
const indexDb = new IndexDB(path.join(rootDir, '.database.db'));

module.exports = {
	indexDb,
	rootDir,
}
