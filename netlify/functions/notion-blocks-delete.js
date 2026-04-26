const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

exports.handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ message: 'NOTION_TOKEN not configured' }) };
  }

  // Extract block ID from: /api/notion/blocks/{id}
  const parts = event.path.split('/');
  const blockId = parts[parts.length - 1];

  if (!blockId || blockId === 'blocks') {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing block ID' }) };
  }

  if (event.httpMethod === 'DELETE') {
    try {
      const res = await fetch(`${NOTION_API}/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': NOTION_VERSION,
        },
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
};
