const sqlite3 = require('sqlite3').verbose();

class IndexDB {
	constructor(databasePath) {
		this.db = new sqlite3.Database(databasePath, (err) => {
			if (err) {
				console.error('Error opening database:', err.message);
			} else {
				console.log('Connected to the database.');
				this.createTables();
			}
		});
	}

	createTables() {
		const createNodesTable = `
      CREATE TABLE IF NOT EXISTS nodes (
        id TEXT PRIMARY KEY,
        collection TEXT NOT NULL,
        title TEXT NOT NULL,
        file TEXT NOT NULL,
        tags TEXT, -- Comma-separated tags
        createdOn DATETIME,
        updatedOn DATETIME,
        extras TEXT -- JSON representation of extras (key-value pairs)
      )
    `;

		const createLinksTable = `
      CREATE TABLE IF NOT EXISTS links (
        collection TEXT NOT NULL,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        inline TEXT,
        FOREIGN KEY (source) REFERENCES nodes (id),
        FOREIGN KEY (target) REFERENCES nodes (id)
      )
    `;

		this.db.run(createNodesTable, (err) => {
			if (err) {
				console.error('Error creating nodes table:', err.message);
			} else {
				console.log('Nodes table created or already exists.');
			}
		});

		this.db.run(createLinksTable, (err) => {
			if (err) {
				console.error('Error creating links table:', err.message);
			} else {
				console.log('Links table created or already exists.');
			}
		});
	}

	// Create or update a node
	createOrUpdateNode(id, collection, title, file, tags, createdOn, updatedOn, extras) {
		const insertOrUpdateNodeQuery = `
      INSERT OR REPLACE INTO nodes (id, collection, title, file, tags, createdOn, updatedOn, extras)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
		this.db.run(
			insertOrUpdateNodeQuery,
			[id, collection, title, file, tags, createdOn, updatedOn, JSON.stringify(extras)],
			(err) => {
				if (err) {
					console.error('Error creating or updating node:', err.message);
				} else {
					console.log('Node created or updated.');
				}
			}
		);
	}

	async nodesWhere(where) {
		const selectNodesQuery = `SELECT * FROM nodes WHERE ${where}`;
		const rows =  await this.queryDatabase(selectNodesQuery);
		return rows.map((e) => {
			return {
				... e,
				tags: e.tags?.split(' '),
			};
		});
	}

	deleteNode(id) {
		const deleteNodeQuery = 'DELETE FROM nodes WHERE id = ?';
		this.db.run(deleteNodeQuery, [id], (err) => {
			if (err) {
				console.error('Error deleting node:', err.message);
			} else {
				console.log('Node deleted.');
			}
		});
	}

	createLink(collection, from, to, inline) {
		const insertLinkQuery = 'INSERT INTO links (collection, source, target, inline) VALUES (?, ?, ?, ?)';
		this.db.run(insertLinkQuery, [collection, from, to, inline], (err) => {
			if (err) {
				console.error('Error creating link:', err.message);
			} else {
				console.log('Link created.');
			}
		});
	}

	async linksWhere(where) {
		const selectLinksQuery = `SELECT * FROM links WHERE ${where}`;
		return this.queryDatabase(selectLinksQuery);
	}

	deleteLink(from, to) {
		const deleteLinkQuery = 'DELETE FROM links WHERE source = ? AND target = ?';
		this.db.run(deleteLinkQuery, [from, to], (err) => {
			if (err) {
				console.error('Error deleting link:', err.message);
			} else {
				console.log('Link deleted.');
			}
		});
	}

	deleteLinksFrom(from) {
		const deleteLinksQuery = 'DELETE FROM links WHERE source = ?';

		this.db.run(deleteLinksQuery, [from], (err) => {
			if (err) {
				console.error('Error deleting links:', err.message);
			} else {
				console.log('Links deleted.');
			}
		});
	}

	dropCollection(collection) {
		const dropQuery = `
			DELETE FROM nodes WHERE collection = '${collection}';
			DELETE FROM links WHERE collection = '${collection}';
		`;

		this.db.serialize(() => {
			this.db.exec(dropQuery, (err) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Collection dropped');
				}
			});
		});
	}

	queryDatabase(sql) {
		return new Promise((resolve, reject) => {
			this.db.all(sql, [], (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	close() {
		this.db.close((err) => {
			if (err) {
				console.error('Error closing database:', err.message);
			} else {
				console.log('Database closed.');
			}
		});
	}
}


module.exports = IndexDB;
