class NotesApi {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async createNote() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '# New Note Content',
          tags: ['tag1', 'tag2'],
        }),
      });
      
      const data = await response.json();
      console.log('Created Note:', data);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async updateNote(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '# Updated Note Content',
          tags: ['tag1', 'tag2'],
        }),
      });
      
      const data = await response.json();
      console.log('Updated Note:', data);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  async getNote(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes/${id}`);
      const data = await response.json();
      console.log('Note:', data);
    } catch (error) {
      console.error('Error getting note:', error);
    }
  }

  async deleteNote(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      console.log('Note Deleted:', data.message);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async getNotes() {
    try {
      // const includeTagsParam = includeTags.join(',');
      // const excludeTagsParam = excludeTags.join(',');
      // const url = `${this.apiBaseUrl}/notes?include_tags=${includeTagsParam}&exclude_tags=${excludeTagsParam}`;
      const url = `${this.apiBaseUrl}/notes`;
      
      const response = await fetch(url);
      const data = await response.json();
			return data;
    } catch (error) {
      console.error('Error getting filtered notes:', error);
    }
  }

  async getTags() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tags`);
      const data = await response.json();
      console.log('Tags:', data);
    } catch (error) {
      console.error('Error getting tags:', error);
    }
  }
}

export default NotesApi;
