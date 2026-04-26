const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

exports.handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ message: 'NOTION_TOKEN not configured' }) };
  }

  const blockId = event.queryStringParameters?.id;
  if (!blockId) {
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
