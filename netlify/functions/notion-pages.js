const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

exports.handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ message: 'NOTION_TOKEN not configured' }) };
  }

  // POST /api/notion/pages → create a new page
  if (event.httpMethod === 'POST') {
    try {
      const res = await fetch(`${NOTION_API}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: event.body,
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
