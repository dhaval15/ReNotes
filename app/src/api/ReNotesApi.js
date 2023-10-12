import axios from 'axios';

class ReNotesApi {
  constructor(token) {
    this.client = axios.create({
      baseURL: '/api',
			headers: {
				'Authorization': `${token}`,
				'Content-Type': 'application/json',
			},
    });
  }

	static async login(username, password) {
		const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
			return data;
    } else {
      throw new Error('Login failed');
    }
	}

  // GET all collections
  async getCollections() {
    try {
      const response = await this.client.get('/collections');
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch collections');
    }
  }

  // POST create a collection
  async createCollection(name) {
    try {
      const response = await this.client.post('/collection', { name });
      return response.data;
    } catch (error) {
      throw new Error('Unable to create collection');
    }
  }

  // DELETE a collection
  async deleteCollection(name, drop) {
    try {
      await this.client.delete(`/collection/${name}`, { data: { drop } });
    } catch (error) {
      throw new Error('Unable to delete collection');
    }
  }

  // GET a collection by name
  async getCollection(name) {
    try {
      const response = await this.client.get(`/collection/${name}`);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch collection');
    }
  }

  // GET a node by ID
  async getNode(collectionName, nodeId) {
    try {
      const response = await this.client.get(`/collection/${collectionName}/node/${nodeId}`);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch node');
    }
  }

  // POST create a new node
  async createNode(collectionName, title, tags, content, extras) {
    try {
      const response = await this.client.post(`/collection/${collectionName}/node`, {
        title,
        tags,
        content,
        extras,
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to create node');
    }
  }

  // DELETE a node by ID
  async deleteNode(collectionName, nodeId) {
    try {
      await this.client.delete(`/collection/${collectionName}/node/${nodeId}`);
    } catch (error) {
      throw new Error('Unable to delete node');
    }
  }

  // PUT update a node by ID
  async updateNode(collectionName, nodeId, content, updatedData) {
    try {
      const response = await this.client.put(`/collection/${collectionName}/node/${nodeId}`, {
        content,
        updatedData,
      });
      return response.data;
    } catch (error) {
      throw new Error('Unable to update node');
    }
  }
}

export default ReNotesApi;
