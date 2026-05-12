const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

exports.handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ message: 'NOTION_TOKEN not configured' }) };
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };

  const method = event.httpMethod;
  const path = event.path.replace(/^\/.netlify\/functions\/notion/, '').replace(/^\/api\/notion/, '') || '/';

  try {
    // POST /pages — create a page
    if (method === 'POST' && path === '/pages') {
      const res = await fetch(`${NOTION_API}/pages`, { method: 'POST', headers, body: event.body });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    // PATCH /pages/:id — update page
    if (method === 'PATCH' && path.startsWith('/pages/')) {
      const pageId = path.split('/')[2];
      const res = await fetch(`${NOTION_API}/pages/${pageId}`, { method: 'PATCH', headers, body: event.body });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    // POST /databases/:id/query — query a database (stats + edit existing)
    if (method === 'POST' && path.startsWith('/databases/') && path.endsWith('/query')) {
      const dbId = path.split('/')[2];
      const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, { method: 'POST', headers, body: event.body || '{}' });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    // GET /blocks/:id/children — list blocks
    if (method === 'GET' && path.includes('/children')) {
      const blockId = path.split('/')[2];
      const res = await fetch(`${NOTION_API}/blocks/${blockId}/children?page_size=100`, { method: 'GET', headers });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    // PATCH /blocks/:id/children — append blocks
    if (method === 'PATCH' && path.includes('/children')) {
      const blockId = path.split('/')[2];
      const res = await fetch(`${NOTION_API}/blocks/${blockId}/children`, { method: 'PATCH', headers, body: event.body });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    // DELETE /blocks/:id — delete a block
    if (method === 'DELETE' && path.startsWith('/blocks/')) {
      const blockId = path.split('/')[2];
      const res = await fetch(`${NOTION_API}/blocks/${blockId}`, { method: 'DELETE', headers });
      const data = await res.json();
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    return { statusCode: 404, body: JSON.stringify({ message: `Unhandled route: ${method} ${path}` }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
