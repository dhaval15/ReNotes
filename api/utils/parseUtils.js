// Function to create slug
function generateSlug(title, date) {
  const timestamp = date.toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);

  const titleSlug = title
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  return `${timestamp}T-${titleSlug}`;
}

// Function to extract front matter from content
function extractProperties(text) {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = text.match(frontMatterRegex);

  if (match && match[1]) {
    const frontMatterLines = match[1].split('\n');
    const frontMatter = {};

    for (const line of frontMatterLines) {
      const [key, value] = line.split(':').map((str) => str.trim());
			if (value != '')
      	frontMatter[key] = value;
    }

    return frontMatter;
  }

  return {};
}

// Function to extract content from content
function extractContent(text) {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = text.match(frontMatterRegex);

  if (match && match[1]) {
    const contentStartIndex = match[0].length;
    const extractedContent = text.substring(contentStartIndex).trim();
    return extractedContent;
  }

  return text;
}

// Function to serialize front matter to YAML
function serializeProperties(frontMatter) {
  let yamlFrontMatter = '---\n';

  for (const key of Object.keys(frontMatter)) {
		const value = (key == 'tags' ? frontMatter[key].join(' '): frontMatter[key]).trim();
		if (value != '')
    	yamlFrontMatter += `${key}: ${value}\n`;
  }

  yamlFrontMatter += '---\n';

  return yamlFrontMatter;
}

// Function to extract links from a node's content
function extractLinks(from, content) {
  const linkRegex = /\[([^\]]+)\]\(id:([^\)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const inline = match[1];
    const to = match[2];
    links.push({ from, to, inline });
  }

  return links;
}

module.exports = {
	extractProperties,
	extractContent,
	serializeProperties,
	extractLinks,
};
