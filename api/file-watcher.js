const chokidar = require('chokidar');
const path = require('path');
const ingester = require('./ingester');
const { rootDir, indexDb } = require('./config');

const watcher = chokidar.watch(rootDir, {
	ignoreInitial: true,
	persistent: true,
	cwd: rootDir,
	ignored: /(^|[/\\])\../,
});

function parsePath(filePath){
	const match = filePath.match(new RegExp(`^([^/]+)(?:/(.*))?$`));

	if (match) {
		const collection = match[1];
		const relativePath = match[2] || '';

		return {collection, relativePath};
	} else {
		console.error('Invalid filePath format.');
	}
}

watcher.on('all', async (event, filePath) => {
	if (path.extname(filePath) === '.md') {
		const { collection, relativePath } = parsePath(filePath);
		if (event === 'add' || event === 'change') {
			ingester.onFileCreatedOrUpdated(indexDb, collection, relativePath);
		} else if (event === 'unlink') {
			await ingester.onFileRemoved(indexDb, collection, relativePath);
		}
	}
});

