const fs = require('fs');
const path = require('path');
const parseUtils = require('./utils/parseUtils');
const { rootDir } = require('./config');

function onFileCreatedOrUpdated(indexDB, collection, relativePath) {
	const filePath = path.join(rootDir, collection, relativePath);
	fs.readFile(filePath, 'utf8', (err, text) => {
		if (err) {
			console.error('Error reading file:', err);
			return;
		}

		const {
			id,
			title,
			tags,
			createdOn,
			updatedOn,
			...extras
		} = parseUtils.extractProperties(text);

		const links = parseUtils.extractLinks(id, text);

		indexDB.db.serialize(() => {
			indexDB.db.run('BEGIN TRANSACTION');

			try {
				indexDB.createOrUpdateNode(
					id,
					collection,
					title,
					relativePath,
					tags?.join(' ') ?? '',
					createdOn,
					updatedOn,
					extras);

				indexDB.deleteLinksFrom(id);
				for (const link of links) {
					indexDB.createLink(collection, id, link.to, link.inline);
				}

				indexDB.db.run('COMMIT');
			} catch (error) {
				indexDB.db.run('ROLLBACK');
				console.error('Error processing file:', error);
			}
		});
	});
}

async function onFileRemoved(indexDB, collection, relativePath) {
	const nodes = await indexDB.nodesWhere(`collection = '${collection}' AND file = '${relativePath}'`);
	const node = nodes[0];

	indexDB.db.serialize(() => {
		indexDB.db.run('BEGIN TRANSACTION');

		try {
			indexDB.deleteNode(node.id);
			indexDB.deleteLinksFrom(node.id);
			indexDB.db.run('COMMIT');
		} catch (error) {
			indexDB.db.run('ROLLBACK');
			console.error('Error processing file:', error);
		}
	});
}

module.exports = {
	onFileCreatedOrUpdated,
	onFileRemoved,
};
