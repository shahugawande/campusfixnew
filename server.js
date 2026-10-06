require('dotenv').config();
const express = require('express'), cors = require('cors'), helmet = require('helmet'), rateLimit = require('express-rate-limit');
const { createClient } = require('@libsql/client'); // Turso (free cloud SQLite). Without TURSO_URL it uses a local file.
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), path = require('path'), crypto = require('crypto');
const { CATS, META } = require('./serverconfig');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || (console.warn('⚠  JWT_SECRET missing: using a temporary one (logins reset on restart)'), crypto.randomBytes(32).toString('hex'));
const client = createClient({ url: process.env.TURSO_URL || 'file:campusfix.db', authToken: process.env.TURSO_TOKEN || undefined });

// ---------- database helpers (async) ----------
const rowsOf = rs => rs.rows.map(r => Object.fromEntries(rs.columns.map((c, i) => [c, r[i]])));
const all = async (sql, args = []) => rowsOf(await client.execute({ sql, args }));
const get = async (sql, args = []) => (await all(sql, args))[0];
const run = async (sql, args = []) => { const rs = await client.execute({ sql, args }); return { lastInsertRowid: Number(rs.lastInsertRowid ?? 0), changes: rs.rowsAffected }; };
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, role TEXT NOT NULL CHECK(role IN('student','admin')), login TEXT NOT NULL, name TEXT NOT NULL, hash TEXT NOT NULL,
  year TEXT, branch TEXT, division TEXT, incharge TEXT, dept TEXT, created INTEGER NOT NULL, UNIQUE(role, login));
CREATE TABLE IF NOT EXISTS issues(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), category TEXT NOT NULL, sub TEXT, building TEXT, room TEXT,
  details TEXT NOT NULL, priority TEXT DEFAULT 'Normal', anon INTEGER DEFAULT 0, conf INTEGER DEFAULT 0, status TEXT DEFAULT 'Reported', assigned TEXT, eta TEXT,
  rating INTEGER, created INTEGER NOT NULL, fixed INTEGER);
CREATE TABLE IF NOT EXISTS votes(issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE, user_id INTEGER, PRIMARY KEY(issue_id, user_id));
CREATE TABLE IF NOT EXISTS hist(id INTEGER PRIMARY KEY, issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE, status TEXT, note TEXT, actor TEXT, ts INTEGER);
CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE, user_id INTEGER, name TEXT, role TEXT, body TEXT, ts INTEGER);
CREATE TABLE IF NOT EXISTS photos(token TEXT PRIMARY KEY, issue_id INTEGER, kind TEXT, mime TEXT, data TEXT);
CREATE INDEX IF NOT EXISTS ix_issue ON issues(status, category);`;
const INS_USER = 'INSERT INTO users(role,login,name,hash,year,branch,division,incharge,dept,created) VALUES(?,?,?,?,?,?,?,?,?,?)';
const INS_HIST = 'INSERT INTO hist(issue_id,status,note,actor,ts) VALUES(?,?,?,?,?)';

// ---------- helpers ----------
const now = () => Date.now(), str = (v, n) => String(v ?? '').trim().slice(0, n), idOf = v => Number.isInteger(+v) ? +v : 0;
const bad = (res, m, c = 400) => res.status(c).json({ error: m });
const h = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const pub = u => ({ id: u.id, role: u.role, login: u.login, name: u.name, year: u.year, branch: u.branch, division: u.division, incharge: u.incharge, dept: u.dept });
const tok = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
async function storePhoto(issueId, kind, d) { // photos live in the database (cloud hosts lose local files)
  if (!d || typeof d !== 'string' || d.length > 2.2e6) return;
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(d); if (!m) return;
  await run('DELETE FROM photos WHERE issue_id=? AND kind=?', [issueId, kind]);
  await run('INSERT INTO photos(token,issue_id,kind,mime,data) VALUES(?,?,?,?,?)', [crypto.randomBytes(16).toString('hex'), issueId, kind, 'image/' + m[1], m[2]]);
}
const auth = roles => async (req, res, next) => {
  let u = null;
  try { const p = jwt.verify((req.headers.authorization || '').slice(7), SECRET); u = await get('SELECT * FROM users WHERE id=?', [p.id]); } catch (e) { u = null; }
  if (!u) return bad(res, 'Please sign in', 401);
  if (roles && !roles.includes(u.role)) return bad(res, 'This action is not available for your account type', 403);
  req.u = u; next();
};
const BASE = `SELECT i.*, u.name uname, u.login ulogin, u.year uyear, u.branch ubranch, u.division udiv, u.incharge uinc,
 (SELECT COUNT(*) FROM votes v WHERE v.issue_id=i.id) votes, (SELECT 1 FROM votes v WHERE v.issue_id=i.id AND v.user_id=:uid) voted,
 (SELECT token FROM photos p WHERE p.issue_id=i.id AND p.kind='before') ptok, (SELECT token FROM photos p WHERE p.issue_id=i.id AND p.kind='after') atok
 FROM issues i JOIN users u ON u.id=i.user_id`;
const fmt = (r, u) => ({
  id: r.id, code: 'CF-' + String(r.id).padStart(4, '0'), category: r.category, sub: r.sub, building: r.building, room: r.room, details: r.details,
  priority: r.priority, anon: !!r.anon, conf: !!r.conf, status: r.status, assigned: r.assigned, eta: r.eta,
  photo: r.ptok ? '/api/photo/' + r.ptok : null, after: r.atok ? '/api/photo/' + r.atok : null,
  rating: r.rating, created: r.created, fixed: r.fixed, votes: r.votes ?? 0, voted: !!r.voted, mine: r.user_id === u.id,
  reporter: u.role === 'admin' && !r.anon ? { name: r.uname, prn: r.ulogin, year: r.uyear, branch: r.ubranch, division: r.udiv, incharge: r.uinc } : null
});
const canSee = (r, u) => u.role === 'admin' || !r.conf || r.user_id === u.id;

// ---------- app ----------
const app = express();
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: { useDefaults: true, directives: { 'upgrade-insecure-requests': null, 'script-src': ["'self'", "'unsafe-inline'"] } } }));
app.use(express.json({ limit: '4mb' })); // read JSON request bodies (needed for login / register)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get(['/app.js', '/style.css', '/config.js', '/manifest.json', '/service-worker.js'], (req, res) => res.sendFile(path.join(__dirname, req.path)));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), { dotfiles: 'allow' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Try again in 15 minutes.' } }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: now() })); // also used by the free uptime pinger
app.get('/api/meta', (req, res) => res.json({ cats: CATS, ...META }));
app.get('/api/photo/:token', h(async (req, res) => {
  const p = await get('SELECT mime,data FROM photos WHERE token=?', [str(req.params.token, 40)]); if (!p) return bad(res, 'Not found', 404);
  res.set({ 'Content-Type': p.mime, 'Cache-Control': 'public, max-age=604800' }).send(Buffer.from(p.data, 'base64'));
}));

// ----- auth: students and admins are separate accounts with separate login -----
app.post('/api/auth/register-student', h(async (req, res) => {
  const b = req.body || {}, prn = str(b.prn, 16).toUpperCase(), name = str(b.name, 60), pw = String(b.password || ''), div = str(b.division, 10), inc = str(b.incharge, 60);
  if (!/^[A-Z0-9]{6,16}$/.test(prn)) return bad(res, 'Enter a valid PRN (6-16 letters or digits)');
  if (name.length < 2) return bad(res, 'Enter your full name');
  if (!META.years.includes(b.year)) return bad(res, 'Select your year');
  if (!META.branches.includes(b.branch)) return bad(res, 'Select your branch');
  if (!div) return bad(res, 'Enter your division / class');
  if (inc.length < 3) return bad(res, 'Enter your class incharge name');
  if (pw.length < 8) return bad(res, 'Password must be at least 8 characters');
  if (await get("SELECT 1 x FROM users WHERE role='student' AND login=?", [prn])) return bad(res, 'This PRN is already registered. Please sign in.', 409);
  const r = await run(INS_USER, ['student', prn, name, bcrypt.hashSync(pw, 10), b.year, b.branch, div, inc, null, now()]);
  const u = await get('SELECT * FROM users WHERE id=?', [r.lastInsertRowid]); res.json({ token: tok(u), user: pub(u) });
}));
app.post('/api/auth/register-admin', h(async (req, res) => {
  const b = req.body || {}, id = str(b.userId, 20).toLowerCase(), name = str(b.name, 60), pw = String(b.password || '');
  const want = Buffer.from(process.env.ADMIN_INVITE_CODE || ''), got = Buffer.from(String(b.inviteCode || ''));
  if (!want.length || want.length !== got.length || !crypto.timingSafeEqual(want, got)) return bad(res, 'Invalid admin invite code', 403);
  if (!/^[a-z0-9_.]{4,20}$/.test(id)) return bad(res, 'User ID: 4-20 letters, digits, dot or underscore');
  if (name.length < 2) return bad(res, 'Enter your full name');
  if (!META.depts.includes(b.dept)) return bad(res, 'Select your department');
  if (pw.length < 8) return bad(res, 'Password must be at least 8 characters');
  if (await get("SELECT 1 x FROM users WHERE role='admin' AND login=?", [id])) return bad(res, 'This admin ID is already taken', 409);
  const r = await run(INS_USER, ['admin', id, name, bcrypt.hashSync(pw, 10), null, null, null, null, b.dept, now()]);
  const u = await get('SELECT * FROM users WHERE id=?', [r.lastInsertRowid]); res.json({ token: tok(u), user: pub(u) });
}));
app.post('/api/auth/login', h(async (req, res) => {
  const b = req.body || {}, role = b.role === 'admin' ? 'admin' : 'student', lg = str(b.login, 30);
  const u = await get('SELECT * FROM users WHERE role=? AND login=?', [role, role === 'student' ? lg.toUpperCase() : lg.toLowerCase()]);
  if (!u || !bcrypt.compareSync(String(b.password || ''), u.hash)) return bad(res, role === 'admin' ? 'Invalid admin ID or password' : 'Invalid PRN or password', 401);
  res.json({ token: tok(u), user: pub(u) });
}));
app.get('/api/me', auth(), (req, res) => res.json({ user: pub(req.u) }));

// ----- issues -----
app.post('/api/issues', auth(['student']), h(async (req, res) => {
  const b = req.body || {}, c = CATS[b.category]; if (!c) return bad(res, 'Choose a category');
  const sub = c.subs.includes(b.sub) ? b.sub : null, details = str(b.details, 600), room = str(b.room, 60);
  if (!sub) return bad(res, 'Choose the specific problem'); if (details.length < 5) return bad(res, 'Please describe the problem');
  if (!META.buildings.includes(b.building)) return bad(res, 'Choose a location');
  const anon = c.forceAnon || b.anon ? 1 : 0, pri = c.forceUrgent || b.priority === 'Urgent' ? 'Urgent' : 'Normal';
  if (!c.conf) { // duplicate detection: same place + same problem already open -> add a "me too"
    const d = await get("SELECT id FROM issues WHERE status!='Fixed' AND conf=0 AND category=? AND sub=? AND building=? AND lower(room)=lower(?)", [b.category, sub, b.building, room]);
    if (d) { await run('INSERT OR IGNORE INTO votes VALUES(?,?)', [d.id, req.u.id]); return res.json({ duplicate: true, id: d.id }); }
  }
  const r = await run('INSERT INTO issues(user_id,category,sub,building,room,details,priority,anon,conf,created) VALUES(?,?,?,?,?,?,?,?,?,?)',
    [req.u.id, b.category, sub, b.building, room, details, pri, anon, c.conf ? 1 : 0, now()]);
  await run(INS_HIST, [r.lastInsertRowid, 'Reported', 'Complaint submitted', anon ? 'Anonymous student' : req.u.name, now()]);
  await storePhoto(r.lastInsertRowid, 'before', b.photo);
  res.json({ id: r.lastInsertRowid });
}));
app.get('/api/issues', auth(), h(async (req, res) => {
  const q = req.query, w = ['1=1'], a = { uid: req.u.id };
  if (req.u.role !== 'admin') w.push('(i.conf=0 OR i.user_id=:uid)');
  if (META.statuses.includes(q.status)) { w.push('i.status=:st'); a.st = q.status; }
  if (CATS[q.category]) { w.push('i.category=:cat'); a.cat = q.category; }
  if (q.mine === '1') w.push('i.user_id=:uid');
  if (req.u.role === 'admin' && META.depts.includes(q.dept)) w.push(`i.category IN (${Object.keys(CATS).filter(k => CATS[k].dept === q.dept).map(k => `'${k}'`).join(',')})`);
  if (q.q) { w.push('(i.details LIKE :s OR i.room LIKE :s OR i.building LIKE :s OR i.sub LIKE :s)'); a.s = '%' + str(q.q, 40) + '%'; }
  res.json((await all(`${BASE} WHERE ${w.join(' AND ')} ORDER BY (i.status='Fixed'), i.created DESC LIMIT 300`, a)).map(r => fmt(r, req.u)));
}));
app.get('/api/issues/:id', auth(), h(async (req, res) => {
  const r = await get(BASE + ' WHERE i.id=:id', { id: idOf(req.params.id), uid: req.u.id });
  if (!r || !canSee(r, req.u)) return bad(res, 'Not found', 404);
  res.json({ ...fmt(r, req.u), hist: await all('SELECT status,note,actor,ts FROM hist WHERE issue_id=? ORDER BY ts', [r.id]), comments: await all('SELECT name,role,body,ts FROM comments WHERE issue_id=? ORDER BY ts', [r.id]) });
}));
app.post('/api/issues/:id/vote', auth(['student']), h(async (req, res) => {
  const r = await get('SELECT * FROM issues WHERE id=?', [idOf(req.params.id)]); if (!r || !canSee(r, req.u)) return bad(res, 'Not found', 404);
  await run('INSERT OR IGNORE INTO votes VALUES(?,?)', [r.id, req.u.id]); res.json({ ok: true });
}));
app.post('/api/issues/:id/comments', auth(), h(async (req, res) => {
  const r = await get('SELECT * FROM issues WHERE id=?', [idOf(req.params.id)]), t = str(req.body?.body, 500);
  if (!r || !canSee(r, req.u)) return bad(res, 'Not found', 404); if (!t) return bad(res, 'Write a message');
  const name = req.u.role === 'admin' ? `${req.u.name} · ${req.u.dept}` : (r.anon && r.user_id === req.u.id ? 'Anonymous student' : req.u.name);
  await run('INSERT INTO comments(issue_id,user_id,name,role,body,ts) VALUES(?,?,?,?,?,?)', [r.id, req.u.id, name, req.u.role, t, now()]); res.json({ ok: true });
}));
app.post('/api/issues/:id/rate', auth(['student']), h(async (req, res) => {
  const n = +req.body?.rating, r = await get('SELECT * FROM issues WHERE id=?', [idOf(req.params.id)]);
  if (!r || r.user_id !== req.u.id || r.status !== 'Fixed') return bad(res, 'You can rate only your own fixed complaints', 403);
  if (!(n >= 1 && n <= 5)) return bad(res, 'Rating must be 1-5'); await run('UPDATE issues SET rating=? WHERE id=?', [Math.round(n), r.id]); res.json({ ok: true });
}));
app.patch('/api/issues/:id', auth(['admin']), h(async (req, res) => {
  const id = idOf(req.params.id), r = await get('SELECT * FROM issues WHERE id=?', [id]); if (!r) return bad(res, 'Not found', 404);
  const b = req.body || {}, st = META.statuses.includes(b.status) ? b.status : r.status;
  await run('UPDATE issues SET status=?, assigned=?, eta=?, fixed=? WHERE id=?', [st,
    'assigned' in b ? str(b.assigned, 60) || null : r.assigned ?? null, 'eta' in b ? str(b.eta, 10) || null : r.eta ?? null, st === 'Fixed' ? (r.fixed || now()) : null, id]);
  if (b.after) await storePhoto(id, 'after', b.after);
  if (st !== r.status || b.note) await run(INS_HIST, [id, st, str(b.note, 200), `${req.u.name} (${req.u.dept})`, now()]);
  res.json({ ok: true });
}));

// ----- analytics -----
app.get('/api/stats', auth(), h(async (req, res) => {
  const L = await all('SELECT category,status,priority,created,fixed,rating FROM issues'), n = L.length, t = now();
  const late = i => ((i.fixed || t) - i.created) > CATS[i.category].sla * 36e5 * (i.priority === 'Urgent' ? .5 : 1);
  const fixed = L.filter(i => i.status === 'Fixed'), rated = L.filter(i => i.rating), pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const byCategory = {}; L.forEach(i => byCategory[i.category] = (byCategory[i.category] || 0) + 1);
  const last14 = Array.from({ length: 14 }, (_, k) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 13 + k); const a = +d; return { day: d.getDate(), n: L.filter(i => i.created >= a && i.created < a + 864e5).length }; });
  res.json({
    total: n, open: n - fixed.length, resolution: pct(fixed.length, n), sla: n ? 100 - pct(L.filter(late).length, n) : 100,
    satisfaction: rated.length ? Math.round(rated.reduce((s, i) => s + i.rating, 0) / rated.length * 20) : 0,
    urgentOpen: L.filter(i => i.status !== 'Fixed' && i.priority === 'Urgent').length,
    avgFixHours: fixed.length ? Math.round(fixed.reduce((s, i) => s + i.fixed - i.created, 0) / fixed.length / 36e5) : 0,
    byCategory, last14
  });
}));
app.get('/api/leaderboard', auth(), h(async (req, res) => {
  const rows = await all(`SELECT u.name, u.branch, u.year, COUNT(i.id) r, SUM(i.status='Fixed') f,
    (SELECT COUNT(*) FROM votes v JOIN issues j ON j.id=v.issue_id WHERE j.user_id=u.id AND j.anon=0 AND j.conf=0) v
    FROM users u JOIN issues i ON i.user_id=u.id AND i.anon=0 AND i.conf=0 WHERE u.role='student' GROUP BY u.id`);
  res.json(rows.map(r => ({ ...r, xp: r.r * 10 + (r.f || 0) * 15 + r.v * 2 })).sort((a, b) => b.xp - a.xp).slice(0, 10));
}));
app.get('/api/admin/export.csv', auth(['admin']), h(async (req, res) => {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = await all(BASE + ' ORDER BY i.created DESC', { uid: req.u.id });
  res.type('text/csv').attachment('campusfix-report.csv').send('Code,Category,Problem,Building,Room,Priority,Status,Assigned,Votes,Created,Fixed,Rating\n' +
    rows.map(r => [`CF-${r.id}`, CATS[r.category]?.label, r.sub, r.building, r.room, r.priority, r.status, r.assigned, r.votes, new Date(r.created).toISOString(), r.fixed ? new Date(r.fixed).toISOString() : '', r.rating].map(q).join(',')).join('\n'));
}));

app.use('/api', (req, res) => bad(res, 'Unknown endpoint', 404));
app.use((err, req, res, next) => { console.error(err); bad(res, 'Server error', 500); });

(async () => {
  await client.executeMultiple(SCHEMA);
  if (process.env.ADMIN_USER && process.env.ADMIN_PASS && !(await get("SELECT 1 x FROM users WHERE role='admin'"))) {
    await run(INS_USER, ['admin', process.env.ADMIN_USER.toLowerCase(), 'Administrator', bcrypt.hashSync(process.env.ADMIN_PASS, 10), null, null, null, null, 'Admin Office', now()]);
    console.log(`✔ First admin created: ${process.env.ADMIN_USER}`);
  }
  app.listen(PORT, () => console.log(`🏫 CampusFix running on http://localhost:${PORT}  (database: ${process.env.TURSO_URL ? 'Turso cloud' : 'local file'})`));
})().catch(e => { console.error('Startup failed:', e.message); process.exit(1); });
