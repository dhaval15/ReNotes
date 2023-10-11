const path = require('path');
const rootDir = process.env.RENOTES_DATA_DIR;
const IndexDB = require('./index-db');
const indexDb = new IndexDB(path.join(rootDir, '.database.db'));
const username = process.env.RENOTES_USERNAME || 'renotes';
const password = process.env.RENOTES_PASSWORD || 'password';
const jwtSecret = process.env.AUTH_SECRET;

module.exports = {
	indexDb,
	rootDir,
	username,
	password,
	jwtSecret,
};
