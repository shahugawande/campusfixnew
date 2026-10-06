'use strict';
const $ = (s, r = document) => r.querySelector(s);
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const API = (window.CF_API || '').replace(/\/$/, ''); // backend URL, set in config.js
const ST = ['Reported', 'Assigned', 'In Progress', 'Fixed'], now = () => Date.now();
let T = localStorage.getItem('cf_t'), U = null, M = null, tab = '', role = 'student', mode = 'login', rep = { cat: null, sub: null, pri: 'Normal', photo: null };
let F = { status: '', category: '', q: '', dept: false };

const toast = m => { const t = document.createElement('div'); t.className = 'toast g'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3500); };
async function api(p, o = {}) {
  const r = await fetch(API + '/api' + p, { method: o.method || (o.body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(T ? { Authorization: 'Bearer ' + T } : {}) }, body: o.body ? JSON.stringify(o.body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { if (r.status === 401 && T && !p.startsWith('/auth')) logout(); throw new Error(j.error || 'Request failed'); }
  return j;
}
const ago = ms => { const m = Math.max(1, Math.round(ms / 6e4)); return m < 60 ? m + 'm' : m < 2880 ? Math.round(m / 60) + 'h' : Math.round(m / 1440) + 'd'; };
const stPct = i => (ST.indexOf(i.status) + 1) * 25;
const slaPct = i => Math.round(((i.fixed || now()) - i.created) / (M.cats[i.category].sla * (i.priority === 'Urgent' ? .5 : 1) * 36e5) * 100);
const good = p => p >= 75 ? 'var(--ok)' : p >= 40 ? 'var(--wa)' : 'var(--er)';
function ring(p, sz = 92, col = 'var(--pr)') {
  p = Math.max(0, Math.min(100, Math.round(p))); const r = sz / 2 - 8, c = 2 * Math.PI * r;
  return `<div class="rg" style="width:${sz}px;height:${sz}px"><svg width="${sz}" height="${sz}"><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" class="rb"/><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" class="rf" style="stroke:${col};stroke-dasharray:${c};stroke-dashoffset:${c}" data-off="${c * (1 - p / 100)}"/></svg><b style="font-size:${sz / 4.4}px">${p}%</b></div>`;
}
const anim = () => requestAnimationFrame(() => document.querySelectorAll('.rf').forEach(e => e.style.strokeDashoffset = e.dataset.off));
function compress(f) {
  return new Promise((res, rej) => { const im = new Image(), u = URL.createObjectURL(f); im.onload = () => { const k = Math.min(1, 800 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', .7)); }; im.onerror = rej; im.src = u; });
}
const opts = a => a.map(x => `<option>${E(x)}</option>`).join('');

// ---------- auth ----------
function logout() { localStorage.removeItem('cf_t'); T = null; U = null; authScreen(); }
function authScreen() {
  const s = role === 'student', reg = mode === 'reg';
  $('#app').innerHTML = `<div class="auth g"><div class="logo big">🏫 Campus<b>Fix</b></div><p class="mu" style="text-align:center">College issue reporting platform</p>
  <div class="seg"><button data-role="student" class="${s ? 'on' : ''}">🎓 Student</button><button data-role="admin" class="${!s ? 'on' : ''}">🛠 Admin</button></div>
  <form id="af" autocomplete="on">
  ${reg ? '<label>Full name</label><input name="name" required maxlength="60">' : ''}
  <label>${s ? 'PRN number' : 'Admin user ID'}</label><input name="login" required maxlength="20" autocomplete="username" placeholder="${s ? 'Enter your PRN number' : 'Enter your user ID'}">
  ${reg && s ? `<div class="row"><div><label>Year</label><select name="year">${opts(M.years)}</select></div><div><label>Division</label><input name="division" required maxlength="10" placeholder="e.g. A"></div></div>
   <label>Branch</label><select name="branch">${opts(M.branches)}</select><label>Class incharge</label><input name="incharge" required maxlength="60" placeholder="Name of your class incharge">` : ''}
  ${reg && !s ? `<label>Department</label><select name="dept">${opts(M.depts)}</select><label>Admin invite code</label><input name="invite" required placeholder="Given by the college administration">` : ''}
  <label>Password</label><input name="password" type="password" required minlength="8" autocomplete="${reg ? 'new-password' : 'current-password'}" placeholder="${reg ? 'Set a password (min 8 characters)' : 'Enter your password'}">
  ${reg ? '<label>Confirm password</label><input name="password2" type="password" required minlength="8">' : ''}
  <button class="btn" style="width:100%;margin-top:18px">${reg ? 'Create account' : 'Sign in'}</button></form>
  <p class="mu" style="text-align:center;margin-top:14px">${reg ? 'Already have an account?' : 'New here?'} <a id="sw">${reg ? 'Sign in' : 'Create your account'}</a></p></div>`;
}
document.addEventListener('submit', async e => {
  if (e.target.id !== 'af') return; e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target)), s = role === 'student';
  try {
    let r;
    if (mode === 'reg') {
      if (f.password !== f.password2) throw new Error('Passwords do not match');
      r = await api(s ? '/auth/register-student' : '/auth/register-admin', { body: s ? { prn: f.login, name: f.name, password: f.password, year: f.year, branch: f.branch, division: f.division, incharge: f.incharge } : { userId: f.login, name: f.name, password: f.password, dept: f.dept, inviteCode: f.invite } });
    } else r = await api('/auth/login', { body: { login: f.login, password: f.password, role } });
    T = r.token; localStorage.setItem('cf_t', T); U = r.user; shell();
  } catch (x) { toast(x.message); }
});

// ---------- shell ----------
function shell() {
  const adm = U.role === 'admin', tabs = adm ? [['console', '🛠 Console'], ['stats', '📊 Analytics']] : [['report', '➕ Report'], ['feed', '🧭 Explore'], ['mine', '👤 My reports'], ['stats', '📊 Dashboard'], ['rank', '🏆 Rank']];
  if (!tabs.some(t => t[0] === tab)) tab = tabs[0][0];
  $('#app').innerHTML = `<header class="g"><div class="logo">🏫 Campus<b>Fix</b></div><div class="who"><b>${E(U.name)}</b><span class="mu">${adm ? E(U.dept) + ' · Admin' : E(U.year) + ' · ' + E(U.branch) + ' · Div ' + E(U.division)}</span></div><button class="ib" id="th">🌓</button><button class="ib" id="lo" title="Sign out">⎋</button></header>
  <nav class="g">${tabs.map(([k, n]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}</nav><main id="v"></main>`;
  draw();
}
async function draw() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  try { await ({ report: vReport, feed: vFeed, mine: vFeed, stats: vStats, rank: vRank, console: vConsole }[tab])(); anim(); } catch (e) { toast(e.message); }
}

// ---------- report ----------
function vReport() {
  const cs = M.cats;
  if (!cs[rep.cat]) rep.cat = null;
  window.scrollTo(0, 0);
  if (!rep.cat) {
    rep.photo = null;
    $('#v').innerHTML = `<div class="c g"><h2>Report an issue</h2><p class="mu">College campus issues only. Similar open reports are merged automatically.</p>
    <label>What is it about?</label><div class="cg">${Object.entries(cs).map(([k, c]) => `<div class="cat" data-cat="${k}"><span>${c.icon}</span>${E(c.label)}</div>`).join('')}</div></div>`;
    return;
  }
  const c = cs[rep.cat];
  $('#v').innerHTML = `<div class="c g"><button class="btn s o" data-cat="none">← Back</button><h2>${c.icon} ${E(c.label)}</h2>
  ${c.conf ? '<div class="warn">🔒 Confidential: only you and the college administration can see this complaint.' + (c.forceAnon ? ' Your identity stays hidden.' : '') + '</div>' : ''}
  <label>Specific problem</label><div class="chips" id="subs">${c.subs.map(s => `<span class="chip ${rep.sub === s ? 'on' : ''}" data-sub="${E(s)}">${E(s)}</span>`).join('')}</div>
  <div class="row"><div><label>Location</label><select id="bld">${opts(M.buildings)}</select></div><div><label>Room / spot</label><input id="room" maxlength="60" placeholder="e.g. Room 304, Lab 2, Counter 1"></div></div>
  <label>Details</label><textarea id="det" maxlength="600" placeholder="Describe the problem..."></textarea>
  <label>Priority</label><div class="chips" id="pri">${['Normal', 'Urgent'].map(p => `<span class="chip ${rep.pri === p ? 'on' : ''}" data-pri="${p}">${p === 'Urgent' ? '🚨 Urgent' : 'Normal'}</span>`).join('')}</div>
  <label>Photo (optional)</label><input type="file" id="ph" accept="image/*">
  <label style="display:flex;gap:8px;align-items:center;text-transform:none;font-size:14px;color:var(--tx)"><input type="checkbox" id="anon" style="width:auto" ${c.forceAnon ? 'checked disabled' : ''}> Report anonymously (admins will not see my name)</label>
  <p><button class="btn" id="go" style="width:100%">Submit report</button></p></div>`;
}
async function submitReport() {
  if (!rep.cat || !rep.sub) return toast('Choose the category and the specific problem');
  try {
    const r = await api('/issues', { body: { category: rep.cat, sub: rep.sub, building: $('#bld').value, room: $('#room').value, details: $('#det').value, priority: rep.pri, anon: $('#anon').checked, photo: rep.photo } });
    toast(r.duplicate ? 'Already reported: your “Me too” was added ✅' : 'Report submitted 🎉'); rep = { cat: null, sub: null, pri: 'Normal', photo: null }; tab = 'feed'; draw();
  } catch (x) { toast(x.message); }
}

// ---------- feed ----------
const card = i => {
  const c = M.cats[i.category];
  return `<div class="c g hv" data-open="${i.id}"><div class="top"><div><b>${c.icon} ${E(c.label)}</b> <small class="mu">#${i.code}</small> ${i.priority === 'Urgent' ? '<span class="pill urg">URGENT</span>' : ''}${i.conf ? ' 🔒' : ''}
  <div class="mu">${E(i.sub)} · ${E(i.building)}${i.room ? ' · ' + E(i.room) : ''}</div></div>${ring(stPct(i), 60, i.status === 'Fixed' ? 'var(--ok)' : 'var(--pr)')}</div>
  <p style="margin:8px 0">${E(i.details).slice(0, 100)}</p><div class="top" style="align-items:center"><span class="mu">${i.status} · ${i.status === 'Fixed' ? 'fixed in ' + ago(i.fixed - i.created) : 'SLA used ' + slaPct(i) + '%'}</span>
  ${U.role === 'student' ? `<button class="btn s o" data-vote="${i.id}">🙋 ${i.votes}</button>` : `<span class="mu">🙋 ${i.votes}</span>`}</div></div>`;
};
const qs = o => new URLSearchParams(Object.entries(o).filter(([, v]) => v)).toString();
function filters(adm) {
  return `<div class="c g"><div class="row"><input id="fq" placeholder="🔎 Search" value="${E(F.q)}" style="flex:2"><select id="fs"><option value="">All status</option>${opts(ST)}</select><select id="fc"><option value="">All categories</option>${Object.entries(M.cats).map(([k, c]) => `<option value="${k}">${E(c.label)}</option>`).join('')}</select>
  ${adm ? `<select id="fd"><option value="">All departments</option>${opts(M.depts)}</select>` : ''}</div></div>`;
}
function bindF() { $('#fs').value = F.status; $('#fc').value = F.category; if ($('#fd')) $('#fd').value = F.dept || ''; }
async function vFeed() {
  const l = await api('/issues?' + qs({ status: F.status, category: F.category, q: F.q, mine: tab === 'mine' ? 1 : 0 }));
  $('#v').innerHTML = (tab === 'mine' ? '' : filters(false)) + `<div class="grid">${l.map(card).join('') || '<p class="mu" style="grid-column:1/-1;text-align:center;padding:40px">Nothing here yet 🎉</p>'}</div>`;
  if (tab !== 'mine') bindF();
}

// ---------- stats ----------
async function rings() {
  const s = await api('/stats');
  return [s, `<div class="rings"><div class="c g">${ring(s.resolution, 110, good(s.resolution))}<b>Resolution rate</b><span class="mu">${s.total - s.open} of ${s.total} fixed</span></div>
  <div class="c g">${ring(s.sla, 110, good(s.sla))}<b>SLA compliance</b><span class="mu">fixed or pending within deadline</span></div>
  <div class="c g">${ring(s.satisfaction, 110, good(s.satisfaction))}<b>Satisfaction</b><span class="mu">from student ratings</span></div>
  <div class="c g">${ring(s.total ? s.open / s.total * 100 : 0, 110, 'var(--wa)')}<b>Open workload</b><span class="mu">${s.open} open · ${s.urgentOpen} urgent</span></div></div>`];
}
async function vStats() {
  const [s, html] = await rings(), mx = Math.max(1, ...s.last14.map(d => d.n)), cat = Object.entries(s.byCategory).sort((a, b) => b[1] - a[1]);
  $('#v').innerHTML = html + `<div class="two"><div class="c g"><h3>Where problems come from</h3>${cat.map(([k, n]) => `<div style="margin:9px 0"><div class="top mu"><span>${M.cats[k].icon} ${E(M.cats[k].label)}</span><b>${Math.round(n / s.total * 100)}%</b></div><div class="bar"><i style="width:${n / s.total * 100}%"></i></div></div>`).join('') || '<p class="mu">No data yet</p>'}</div>
  <div class="c g"><h3>Last 14 days</h3><svg viewBox="0 0 280 110" width="100%">${s.last14.map((d, k) => `<rect x="${k * 20 + 3}" y="${95 - d.n / mx * 80}" width="14" height="${d.n / mx * 80 + 1}" rx="4" fill="#7c6cff"/><text x="${k * 20 + 10}" y="108" font-size="8" text-anchor="middle" fill="currentColor">${d.day}</text>`).join('')}</svg><p class="mu">Average fix time: <b>${s.avgFixHours}h</b></p></div></div>`;
}
async function vRank() {
  const l = await api('/leaderboard');
  $('#v').innerHTML = `<div class="c g"><h2>🏆 Campus leaderboard</h2>${l.map((u, k) => `<div class="pod"><b style="width:28px">${['🥇', '🥈', '🥉'][k] || k + 1}</b><span style="flex:1">${E(u.name)}<br><span class="mu">${E(u.year)} · ${E(u.branch)}</span></span><b>${u.xp} XP</b></div>`).join('') || '<p class="mu">File the first report to claim #1!</p>'}<p class="mu">+10 XP per report · +15 when fixed · +2 per “Me too”. Anonymous and confidential reports earn no XP.</p></div>`;
}

// ---------- admin console ----------
async function vConsole() {
  const [, html] = await rings(), l = await api('/issues?' + qs({ status: F.status, category: F.category, q: F.q, dept: F.dept }));
  $('#v').innerHTML = html + filters(true) + `<div class="c g" style="overflow:auto"><div class="top" style="align-items:center;margin-bottom:8px"><h3 style="margin:0">Issues (${l.length})</h3><span class="row" style="flex:none"><button class="btn s o" id="mydept">My department: ${E(U.dept)}</button><button class="btn s" id="csv">⬇ Export CSV</button></span></div>
  <table><tr><th>ID</th><th>Issue</th><th>Location</th><th>Status</th><th>Progress</th><th>SLA</th><th>🙋</th></tr>${l.map(i => `<tr data-open="${i.id}"><td>${i.code}</td><td>${M.cats[i.category].icon} ${E(i.sub)}${i.priority === 'Urgent' ? ' 🚨' : ''}${i.conf ? ' 🔒' : ''}</td><td>${E(i.building)} ${E(i.room)}</td><td>${i.status}</td><td>${stPct(i)}%</td><td style="color:${slaPct(i) >= 100 && i.status !== 'Fixed' ? 'var(--er)' : 'inherit'}">${slaPct(i)}%</td><td>${i.votes}</td></tr>`).join('')}</table></div>`;
  bindF();
}

// ---------- detail ----------
async function openIssue(id) {
  const i = await api('/issues/' + id), c = M.cats[i.category], adm = U.role === 'admin', sp = slaPct(i);
  $('#md').innerHTML = `<div class="back" data-close><div class="sheet g"><div class="top"><div><h2>${c.icon} ${E(c.label)} <small class="mu">#${i.code}</small></h2><div class="mu">${E(i.sub)} · ${E(i.building)} · ${E(i.room)}</div></div></div>
  <div class="row" style="align-items:center;margin:12px 0"><div style="text-align:center">${ring(stPct(i), 84, i.status === 'Fixed' ? 'var(--ok)' : 'var(--pr)')}<div class="mu">${i.status}</div></div><div style="text-align:center">${ring(Math.min(100, sp), 84, i.status === 'Fixed' ? good(100 - sp + 40) : sp >= 100 ? 'var(--er)' : sp > 70 ? 'var(--wa)' : 'var(--ok)')}<div class="mu">SLA time used</div></div></div>
  <p>${E(i.details)}</p>${i.reporter ? `<div class="warn">👤 ${E(i.reporter.name)} · PRN ${E(i.reporter.prn)} · ${E(i.reporter.year)} ${E(i.reporter.branch)} · Div ${E(i.reporter.division)} · Class incharge: ${E(i.reporter.incharge)}</div>` : adm ? '<div class="warn">🕶 Reported anonymously</div>' : ''}
  ${i.assigned ? `<p class="mu">👷 Assigned: <b>${E(i.assigned)}</b>${i.eta ? ' · ETA ' + E(i.eta) : ''}</p>` : ''}
  ${i.photo ? `<img class="thumb" src="${E(API + i.photo)}" alt="before">` : ''}${i.after ? `<img class="thumb" src="${E(API + i.after)}" alt="after"><p class="mu">After fix ✅</p>` : ''}
  <h3 style="margin-top:14px">Timeline</h3><div class="tl">${i.hist.map(h => `<div><b>${E(h.status)}</b> <span class="mu">${new Date(h.ts).toLocaleString()} · ${E(h.actor)}</span>${h.note ? `<div class="mu">${E(h.note)}</div>` : ''}</div>`).join('')}</div>
  ${!adm ? `<p><button class="btn s o" data-vote="${i.id}">🙋 Me too (${i.votes})</button></p>` : ''}
  ${i.mine && i.status === 'Fixed' && !i.rating ? `<h3>Rate this fix</h3><div class="chips">${[1, 2, 3, 4, 5].map(n => `<span class="chip" data-rate="${n}" data-id="${i.id}">★ ${n}</span>`).join('')}</div>` : ''}
  ${adm ? `<div class="c g"><h3>🛠 Update</h3><label>Status</label><select id="us">${opts(ST)}</select><div class="row"><div><label>Assign to</label><input id="ua" maxlength="60" placeholder="Team or person" value="${E(i.assigned || '')}"></div><div><label>ETA</label><input id="ue" type="date" value="${E(i.eta || '')}"></div></div>
  <label>Update note (visible in timeline)</label><input id="un" maxlength="200"><label>After photo (optional)</label><input type="file" id="uf" accept="image/*"><p><button class="btn" id="usv" data-id="${i.id}" style="width:100%">Save update</button></p></div>` : ''}
  <h3>💬 Conversation</h3>${i.comments.map(m => `<div class="msg ${m.role}"><div class="mu">${E(m.name)} · ${ago(now() - m.ts)} ago</div>${E(m.body)}</div>`).join('') || '<p class="mu">No messages yet.</p>'}
  <div class="row" style="flex-wrap:nowrap;margin-top:8px"><input id="cin" maxlength="500" placeholder="Write a message..."><button class="btn s" id="csn" data-id="${i.id}" style="flex:none">Send</button></div>
  <p><button class="btn o" data-close style="width:100%">Close</button></p></div></div>`;
  if (adm) $('#us').value = i.status; anim();
}

// ---------- events ----------
document.addEventListener('click', async e => {
  const t = e.target, d = t.closest('[data-role],[data-t],[data-cat],[data-sub],[data-pri],[data-vote],[data-open],[data-rate],[data-close]') || t;
  try {
    if (d.dataset?.role) { role = d.dataset.role; authScreen(); }
    else if (t.id === 'sw') { mode = mode === 'login' ? 'reg' : 'login'; authScreen(); }
    else if (d.dataset?.t) { tab = d.dataset.t; draw(); }
    else if (t.id === 'th') { const r = document.documentElement; r.dataset.theme = (r.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark'; }
    else if (t.id === 'lo') logout();
    else if (d.dataset?.cat) { rep.cat = d.dataset.cat; rep.sub = null; vReport(); }
    else if (d.dataset?.sub) { rep.sub = d.dataset.sub; document.querySelectorAll('#subs .chip').forEach(x => x.classList.toggle('on', x === d)); }
    else if (d.dataset?.pri) { rep.pri = d.dataset.pri; document.querySelectorAll('#pri .chip').forEach(x => x.classList.toggle('on', x === d)); }
    else if (t.id === 'go') await submitReport();
    else if (d.dataset?.vote) { e.stopPropagation(); await api(`/issues/${d.dataset.vote}/vote`, { method: 'POST', body: {} }); toast('“Me too” added 🙋'); $('#md').firstChild ? openIssue(d.dataset.vote) : draw(); }
    else if (d.dataset?.rate) { await api(`/issues/${t.dataset.id}/rate`, { body: { rating: +t.dataset.rate } }); toast('Thanks for your feedback ⭐'); openIssue(t.dataset.id); }
    else if (t.id === 'csn') { const v = $('#cin').value.trim(); if (v) { await api(`/issues/${t.dataset.id}/comments`, { body: { body: v } }); openIssue(t.dataset.id); } }
    else if (t.id === 'usv') {
      const b = { status: $('#us').value, assigned: $('#ua').value, eta: $('#ue').value, note: $('#un').value }, f = $('#uf').files[0];
      if (f) { b.after = await compress(f); b.status = 'Fixed'; }
      await api('/issues/' + t.dataset.id, { method: 'PATCH', body: b }); toast('Updated ✅'); openIssue(t.dataset.id); draw();
    }
    else if (t.id === 'mydept') { F.dept = F.dept ? false : U.dept; draw(); }
    else if (t.id === 'csv') { const r = await fetch(API + '/api/admin/export.csv', { headers: { Authorization: 'Bearer ' + T } }), a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = 'campusfix-report.csv'; a.click(); }
    else if (t.closest('[data-open]') && !t.closest('[data-vote]')) await openIssue(t.closest('[data-open]').dataset.open);
    else if (t.matches('[data-close]') || t.closest('button[data-close]')) $('#md').innerHTML = '';
  } catch (x) { toast(x.message); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'fq') { F.q = e.target.value; clearTimeout(window._q); window._q = setTimeout(draw, 350); }
});
document.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'fs') { F.status = t.value; draw(); } else if (t.id === 'fc') { F.category = t.value; draw(); } else if (t.id === 'fd') { F.dept = t.value; draw(); }
  else if (t.id === 'ph' && t.files[0]) { try { rep.photo = await compress(t.files[0]); toast('Photo attached 📷'); } catch (x) { toast('Could not read photo'); } }
});
addEventListener('keydown', e => { if (e.key === 'Escape') $('#md').innerHTML = ''; });
setInterval(() => { if (U && !$('#md').firstChild && tab !== 'report' && !document.activeElement?.matches('input,textarea,select')) draw(); }, 25000);

(async () => {
  try { M = await api('/meta'); } catch (e) { return $('#app').innerHTML = `<div class="auth g"><h2>Cannot reach the backend</h2><p class="mu">Start the backend (<code>npm start</code>) and check <code>CF_API</code> in config.js. Current URL: <b>${E(API || location.origin)}</b></p></div>`; }
  if (T) try { U = (await api('/me')).user; } catch (e) { T = null; }
  U ? shell() : authScreen();
})();
