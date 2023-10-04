// Import necessary modules for file operations
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { rootDir, indexDb } = require('./config');

const parseUtils = require('./utils/parseUtils');
const ingester = require('./ingester');

// ------------- Collection Service ---------------//

async function getAllCollections() {
	try {
		const files = await fs.readdir(rootDir, {withFileTypes: true});
		const collections = files.filter((file) => file.isDirectory()).map((dir) => dir.name);
		return collections;
	} catch (err) {
		throw err;
	}
}

async function createCollection(name) {
	const collectionPath = path.join(rootDir, name);

	try {
		await fs.mkdir(collectionPath);
		return { name };
	} catch (err) {
		throw err;
	}
}

async function deleteCollection(collectionName, drop) {
	const collectionPath = path.join(rootDir, collectionName);

	try {
		if (drop) {
			const dropPath = path.join(rootDir, drop);
			const files = await fs.readdir(collectionPath);
			for (const file of files) {
				if (file.endsWith('.md')) {
					await fs.rename(path.join(collectionPath, file), path.join(dropPath, file));
				}
			}
		}
		await fs.rmdir(collectionPath);
	} catch (err) {
		throw err;
	}
}

// Function to get a collection by name
async function getCollectionByName(name) {
	const filter = `collection = '${name}'`;
	const nodes = await indexDb.nodesWhere(filter);
	const links = await indexDb.linksWhere(filter);
	return {
		name: name,
		nodes: nodes,
		links: links,
	};
}

// ------------- Nodes Service ---------------//

// Function to get a node by ID
async function getNode(collectionName, nodeId) {
	try {
		const nodes = await indexDb.nodesWhere(`collection = '${collectionName}' AND id = '${nodeId}'`);
		const node = nodes[0];
		const nodePath = path.join(rootDir, collectionName, `${node.file}`);
		const text = await fs.readFile(nodePath, 'utf-8');
		const content = parseUtils.extractContent(text);
		const incoming = await indexDb.linksWhere(`collection = '${collectionName}' AND target = '${nodeId}'`);
		const outgoing = await indexDb.linksWhere(`collection = '${collectionName}' AND source = '${nodeId}'`);
		return {
			... node,
			content,
			incoming, 
			outgoing,
		}
	} catch (err) {
		throw err;
	}
}

// Function to create a new node
async function createNode(collectionName, title, tags, content, extras) {
	const nodeId = uuidv4();
	const nodePath = path.join(rootDir, collectionName, `${nodeId}.md`);
	const createdOn = new Date().toISOString();
	const updatedOn = createdOn;

	const frontMatter = {
		id: nodeId,
		title,
		tags,
		createdOn,
		updatedOn,
		...extras,
	};

	const yamlFrontMatter = parseUtils.serializeProperties(frontMatter);

	// Append content
	let nodeContent = yamlFrontMatter;
	if (content) {
		nodeContent += `${content}\n`;
	}

	try {
		await fs.writeFile(nodePath, nodeContent, 'utf-8');
		return { id: nodeId, title, tags, createdOn, updatedOn, ...extras, content };
	} catch (err) {
		throw err;
	}
}


// Function to delete a node by ID
async function deleteNode(collectionName, nodeId) {
	const nodePath = path.join(rootDir, collectionName, `${nodeId}.md`);

	try {
		await fs.unlink(nodePath);
	} catch (err) {
		throw err;
	}
}

// Function to update a node by ID
async function updateNode(collectionName, nodeId, updateData, content) {
	const nodePath = path.join(rootDir, collectionName, `${nodeId}.md`);

	try {
		const text = await fs.readFile(nodePath, 'utf-8');
		const frontMatter = parseUtils.extractProperties(text);
		const newContent = content ?? parseUtils.extractProperties(text);

		// Merge the updateData with existing front matter
		const updatedFrontMatter = {
			...frontMatter,
			...updateData
		};
		const updatedYamlFrontMatter = parseUtils.serializeProperties(updatedFrontMatter);
		const nodeContent = updatedYamlFrontMatter + `${newContent}\n`;

		// Write the updated content back to the file
		await fs.writeFile(nodePath, nodeContent, 'utf-8');

		return { id: nodeId, ...updatedFrontMatter, content: newContent };
	} catch (err) {
		throw err;
	}
}

async function regenerateIndex(name) {
	const collectionPath = path.join(rootDir, name);
	try {
		indexDb.dropCollection(name);

		//Rescan
		const files = await fs.readdir(collectionPath);
		files.forEach((file) => {
			if (file.endsWith('.md')) {
				ingester.onFileCreatedOrUpdated(indexDb, name, file);
			}
		});

		return true;
	} catch (error) {
		console.error('Error regenerating database:', error.message);
		res.status(500).json({ error: 'Database regeneration failed.' });
	}
}

module.exports = {
	getAllCollections,
	createCollection,
	deleteCollection,
	getCollectionByName,
	regenerateIndex,
	getNode,
	createNode,
	deleteNode,
	updateNode,
};

