import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

try {
  process.loadEnvFile(join(dirname(fileURLToPath(import.meta.url)), '.env'));
} catch {
  // no .env present — fall through, the missing-token check below will catch it
}

const CLICKUP_TOKEN = process.env.CLICKUP_API_TOKEN;
const LIST_ID = '901711248949';

if (!CLICKUP_TOKEN) {
  console.error('Missing CLICKUP_API_TOKEN in outputs/website/.env');
  process.exit(1);
}
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let cache = { data: null, ts: 0 };

function isCanada(city = '') {
  const c = city.toLowerCase();
  return c.includes('ontario') || c.includes(' on') || c.includes('london,') ||
    c.includes('toronto') || c.includes('brampton') || c.includes('oakville') ||
    c.includes('mississauga') || c.includes('ottawa') || c.includes('canada') ||
    c.includes('bc') || c.includes('alberta') || c.includes('calgary') ||
    c.includes('vancouver') || c.includes('quebec') || c.includes('waterloo st') ||
    c.includes('british columbia');
}

function parseTask(t) {
  const desc = t.description || '';
  const name = t.name || '';
  const status = t.status?.status || '';
  const tags = (t.tags || []).map(tag => tag.name);

  let phone = '', email = '', city = '', owner = '';
  for (const line of desc.split('\n')) {
    const l = line.replace(/\*\*/g, '').trim();
    if (l.startsWith('Phone:')) phone = l.slice(6).trim();
    else if (l.startsWith('Email:')) email = l.slice(6).trim();
    else if (l.includes('REPLY_EMAIL:')) email = l.split('REPLY_EMAIL:').pop().trim();
    else if (l.startsWith('Owner:')) owner = l.slice(6).trim();
    else if (l.startsWith('City:')) city = l.slice(5).trim();
    else if (l.startsWith('Location:')) city = l.slice(9).trim();
    else if (l.startsWith('Address:') && !city) city = l.slice(8).trim();
  }

  const isMedspa = name.includes('[MEDSPA]');
  let clinicName = name.replace('[LEAD]', '').replace('[MEDSPA]', '').trim();
  if (clinicName.includes('—')) {
    const parts = clinicName.split('—');
    clinicName = parts[0].trim();
    if (!city && parts[1]) city = parts[1].trim();
  }

  for (const suffix of [', Canada', ', USA', ', United States']) {
    city = city.replace(suffix, '');
  }
  city = city.trim();

  let stage = 'to_contact';
  if (tags.includes('replied')) stage = 'replied';
  else if (tags.includes('proposal-sent')) stage = 'proposal_sent';
  else if (tags.includes('cold-call')) stage = 'cold_call';
  else if (status === 'in progress') stage = 'in_sequence';
  else if (status === 'complete') stage = 'complete';

  return { id: t.id, name: clinicName, status, stage, tags, phone, email, city, owner, isMedspa, url: t.url || '' };
}

async function fetchAllLeads() {
  const all = [];
  let page = 0;
  while (true) {
    const res = await fetch(
      `https://api.clickup.com/api/v2/list/${LIST_ID}/task?page=${page}&include_closed=false`,
      { headers: { Authorization: CLICKUP_TOKEN } }
    );
    const json = await res.json();
    const tasks = json.tasks || [];
    all.push(...tasks.map(parseTask));
    if (json.last_page) break;
    page++;
  }
  return all;
}

async function getLeads(force = false) {
  const now = Date.now();
  if (!force && cache.data && (now - cache.ts) < CACHE_TTL) {
    return { leads: cache.data, cached: true, age: Math.round((now - cache.ts) / 1000) };
  }
  console.log(`[${new Date().toISOString()}] Fetching ClickUp leads...`);
  const leads = await fetchAllLeads();
  cache = { data: leads, ts: Date.now() };
  console.log(`[${new Date().toISOString()}] Fetched ${leads.length} leads.`);
  return { leads, cached: false, age: 0 };
}

const server = createServer(async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json',
  };

  const url = req.url.split('?')[0];

  if (url === '/api/leads') {
    try {
      const result = await getLeads(false);
      res.writeHead(200, cors);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, cors);
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (url === '/api/refresh') {
    try {
      const result = await getLeads(true);
      res.writeHead(200, cors);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, cors);
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    res.writeHead(404, cors);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3001, () => {
  console.log('Pipeline API running at http://localhost:3001');
  console.log('  GET /api/leads   — fetch leads (5min cache)');
  console.log('  GET /api/refresh — force refresh from ClickUp');
  // Warm cache on startup
  getLeads(true).catch(console.error);
});
